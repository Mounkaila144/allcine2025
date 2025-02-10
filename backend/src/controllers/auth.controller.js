const bcrypt = require('bcryptjs');
const twilio = require('twilio');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { JWT_SECRET, BCRYPT_ROUNDS } = require('../config/config');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;
const client = twilio(accountSid, authToken);
const RESET_REQUEST_LIMIT = 3; // Nombre maximum de demandes par période
const RESET_COOLDOWN_HOURS = 24; // Période de cooldown en heures
const REGISTER_ATTEMPT_LIMIT = 3; // Nombre maximum de tentatives
const REGISTER_COOLDOWN_HOURS = 24; // Période de cooldown en heures
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOTP = async (phone, otp) => {
    try {
        const message = await client.messages.create({
            from: `whatsapp:${whatsappNumber}`,
            body: `Votre code de vérification est: ${otp}`,
            to: `whatsapp:${phone}`
        });
        return true;
    } catch (error) {
        console.error("Erreur Twilio:", error);
        return false;
    }
};

const register = async (req, res) => {
    try {
        const { password, nom, prenom, phone } = req.body;

        // Vérifier l'utilisateur existant
        let existingUser = await User.findOne({
            where: { phone },
            paranoid: false
        });

        const now = new Date();

        if (existingUser) {
            // Si l'utilisateur est déjà confirmé
            if (existingUser.isConfirme) {
                return res.status(400).json({
                    message: 'Numéro de téléphone déjà utilisé'
                });
            }

            // Vérifier le cooldown et les tentatives
            const hoursSinceLastAttempt = existingUser.lastRegistrationAttempt
                ? (now - new Date(existingUser.lastRegistrationAttempt)) / (1000 * 60 * 60)
                : 24;

            // Calculer le nouveau nombre de tentatives
            let newAttemptCount;
            if (hoursSinceLastAttempt < REGISTER_COOLDOWN_HOURS) {
                newAttemptCount = (existingUser.registrationAttempts || 0) + 1;

                if (newAttemptCount > REGISTER_ATTEMPT_LIMIT) {
                    const hoursRemaining = Math.ceil(REGISTER_COOLDOWN_HOURS - hoursSinceLastAttempt);
                    return res.status(429).json({
                        message: `Trop de tentatives d'inscription. Veuillez réessayer dans ${hoursRemaining} heures.`,
                        nextAttemptAllowed: new Date(now.getTime() + hoursRemaining * 60 * 60 * 1000)
                    });
                }
            } else {
                newAttemptCount = 1; // Réinitialiser si hors période de cooldown
            }

            const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
            const otp = generateOTP();
            const otpExpiration = new Date(now.getTime() + 10 * 60 * 1000);

            // Vérifier si on peut envoyer l'OTP
            const otpSent = await sendOTP(phone, otp);
            if (!otpSent) {
                return res.status(500).json({
                    message: 'Erreur lors de l\'envoi du code de vérification. Veuillez réessayer.'
                });
            }

            // Important: Mettre à jour TOUS les champs nécessaires, y compris les compteurs
            await existingUser.update({
                password: hashedPassword,
                nom,
                prenom,
                otpCode: otp,
                otpExpiration,
                otpAttempts: 0,
                maxOtpAttempts: 3,
                registrationAttempts: newAttemptCount,  // Mise à jour du compteur
                lastRegistrationAttempt: now           // Mise à jour du timestamp
            });

            return res.status(201).json({
                message: 'Code de vérification envoyé sur WhatsApp.',
                userId: existingUser.id,
                remainingAttempts: REGISTER_ATTEMPT_LIMIT - newAttemptCount,
                attemptCount: newAttemptCount
            });

        } else {
            // Première tentative pour ce numéro
            const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
            const otp = generateOTP();
            const otpExpiration = new Date(now.getTime() + 10 * 60 * 1000);

            const otpSent = await sendOTP(phone, otp);
            if (!otpSent) {
                return res.status(500).json({
                    message: 'Erreur lors de l\'envoi du code de vérification. Veuillez réessayer.'
                });
            }

            // Créer un nouvel utilisateur
            const user = await User.create({
                password: hashedPassword,
                nom,
                prenom,
                phone,
                isConfirme: false,
                otpCode: otp,
                otpExpiration,
                otpAttempts: 0,
                maxOtpAttempts: 3,
                registrationAttempts: 1,
                lastRegistrationAttempt: now
            });

            return res.status(201).json({
                message: 'Code de vérification envoyé sur WhatsApp.',
                userId: user.id,
                remainingAttempts: REGISTER_ATTEMPT_LIMIT - 1,
                attemptCount: 1
            });
        }

    } catch (error) {
        console.error("Erreur:", error);
        res.status(500).json({
            message: 'Erreur lors de l\'inscription',
            error: error.message
        });
    }
};
const login = async (req, res) => {
    try {
        const { phone, password } = req.body;
        const user = await User.findOne({ where: { phone } });
        if (!user) {
            return res.status(401).json({ message: 'Numéro de téléphone ou mot de passe incorrect' });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Numéro de téléphone ou mot de passe incorrect' });
        }
        if (!user.isConfirme) {
            return res.status(401).json({ message: 'Le compte n\'est pas vérifié. Veuillez vérifier votre numéro de téléphone.' });
        }
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
                isConfirme: user.isConfirme
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.json({
            message: 'Connexion réussie',
            token,
            user: {
                id: user.id,
                nom: user.nom,
                prenom: user.prenom,
                phone: user.phone,
                role: user.role,
                isConfirme: user.isConfirme
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la connexion',
            error: error.message
        });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { phone, otp } = req.body;

        const user = await User.findOne({ where: { phone } });
        if (!user) {
            return res.status(400).json({ message: 'Utilisateur non trouvé' });
        }

        // Vérifier si l'OTP est expiré
        if (new Date() > user.otpExpiration) {
            return res.status(400).json({ message: 'Code de vérification expiré' });
        }

        // Vérifier le nombre de tentatives
        if (user.otpAttempts >= user.maxOtpAttempts) {
            return res.status(400).json({
                message: 'Nombre maximum de tentatives atteint. Veuillez demander un nouveau code.'
            });
        }

        // Incrémenter le compteur de tentatives
        await user.increment('otpAttempts');

        if (user.otpCode !== otp) {
            return res.status(400).json({
                message: 'Code de vérification incorrect',
                remainingAttempts: user.maxOtpAttempts - (user.otpAttempts + 1)
            });
        }

        // Validation réussie
        user.isConfirme = true;
        user.otpCode = null;
        user.otpExpiration = null;
        user.otpAttempts = 0;
        await user.save();

        res.json({ message: 'Vérification réussie. Votre compte est activé !' });

    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la vérification',
            error: error.message
        });
    }
};

const requestPasswordReset = async (req, res) => {
    try {
        const { phone } = req.body;

        const user = await User.findOne({ where: { phone } });
        if (!user) {
            return res.status(400).json({ message: 'Utilisateur non trouvé' });
        }

        const now = new Date();

        // Vérifier si la période de cooldown est terminée
        if (user.lastResetRequest) {
            const hoursSinceLastReset = (now - new Date(user.lastResetRequest)) / (1000 * 60 * 60);

            if (hoursSinceLastReset < RESET_COOLDOWN_HOURS) {
                // Si on est dans la période de cooldown, vérifier le nombre de tentatives
                if (user.resetRequestCount >= RESET_REQUEST_LIMIT) {
                    const hoursRemaining = Math.ceil(RESET_COOLDOWN_HOURS - hoursSinceLastReset);
                    return res.status(429).json({
                        message: `Trop de demandes de réinitialisation. Veuillez réessayer dans ${hoursRemaining} heures.`
                    });
                }
            } else {
                // Si la période de cooldown est terminée, réinitialiser le compteur
                user.resetRequestCount = 0;
            }
        }

        const otp = generateOTP();
        const otpExpiration = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes

        const otpSent = await sendOTP(phone, otp);
        if (!otpSent) {
            return res.status(500).json({
                message: 'Erreur lors de l\'envoi du code de vérification'
            });
        }

        // Mettre à jour les informations de réinitialisation
        user.otpCode = otp;
        user.otpExpiration = otpExpiration;
        user.otpAttempts = 0;
        user.lastResetRequest = now;
        user.resetRequestCount = (user.resetRequestCount || 0) + 1;
        await user.save();

        const remainingAttempts = RESET_REQUEST_LIMIT - user.resetRequestCount;
        res.json({
            message: 'Un code de vérification a été envoyé sur WhatsApp',
            remainingAttempts,
            nextResetAvailable: new Date(now.getTime() + RESET_COOLDOWN_HOURS * 60 * 60 * 1000)
        });

    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la demande de réinitialisation',
            error: error.message
        });
    }
};
const resetPassword = async (req, res) => {
    try {
        const { phone, otp, newPassword } = req.body;

        const user = await User.findOne({ where: { phone } });
        if (!user) {
            return res.status(400).json({ message: 'Utilisateur non trouvé' });
        }

        // Vérifications habituelles de l'OTP
        if (new Date() > user.otpExpiration) {
            return res.status(400).json({ message: 'Code de vérification expiré' });
        }

        if (user.otpAttempts >= user.maxOtpAttempts) {
            return res.status(400).json({
                message: 'Nombre maximum de tentatives atteint. Veuillez demander un nouveau code.'
            });
        }

        await user.increment('otpAttempts');

        if (user.otpCode !== otp) {
            return res.status(400).json({
                message: 'Code de vérification incorrect',
                remainingAttempts: user.maxOtpAttempts - (user.otpAttempts + 1)
            });
        }

        // Réinitialisation du mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
        user.password = hashedPassword;
        user.otpCode = null;
        user.otpExpiration = null;
        user.otpAttempts = 0;
        // Réinitialiser le compteur de demandes après un changement réussi
        user.resetRequestCount = 0;
        user.lastResetRequest = null;
        await user.save();

        res.json({ message: 'Mot de passe réinitialisé avec succès' });

    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la réinitialisation du mot de passe',
            error: error.message
        });
    }
};
const resendOTP = async (req, res) => {
    try {
        const { phone } = req.body;

        const user = await User.findOne({ where: { phone } });
        if (!user) {
            return res.status(400).json({ message: 'Utilisateur non trouvé' });
        }

        const otp = generateOTP();
        const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const otpSent = await sendOTP(phone, otp);
        if (!otpSent) {
            return res.status(500).json({
                message: 'Erreur lors de l\'envoi du code de vérification'
            });
        }

        user.otpCode = otp;
        user.otpExpiration = otpExpiration;
        user.otpAttempts = 0;
        await user.save();

        res.json({ message: 'Un nouveau code de vérification a été envoyé' });

    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors du renvoi du code',
            error: error.message
        });
    }
};
module.exports = {
    register,
    login,
    verifyOTP,
    requestPasswordReset,
    resetPassword,
    resendOTP
};