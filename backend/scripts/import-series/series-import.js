const fs = require('fs');
const { Content } = require('../../src/models');

async function importSeries(inputFile) {
    if (!fs.existsSync(inputFile)) {
        throw new Error(`Le fichier ${inputFile} n'existe pas`);
    }

    // Lecture du fichier d'entrée
    const series = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

    const results = {
        success: 0,
        failed: 0,
        errors: [],
        imported: []
    };

    for (let serie of series) {
        try {
            // Vérification si la série existe déjà dans la base de données
            const existingSerie = await Content.findOne({
                where: {
                    titre: serie.titre,
                    type: 'serie'
                }
            });

            if (existingSerie) {
                await existingSerie.update({
                    saisons_possedees: serie.saisons  // Met à jour le nombre de saisons
                    // Vous pouvez ajouter d'autres champs à mettre à jour si nécessaire
                });
                results.success++;
                results.imported.push(`${serie.titre} (mis à jour)`);
                continue;
            }
            const parseReleaseDate = (dateValue) => {
                // Si aucune valeur n'est fournie, on retourne la date du jour
                if (!dateValue) return new Date().toISOString().split('T')[0];

                // Si c'est un entier, on suppose qu'il s'agit d'une année
                if (typeof dateValue === 'number') {
                    return `${dateValue}-01-01`;
                }

                // Si c'est une chaîne
                if (typeof dateValue === 'string') {
                    // Cas où la chaîne représente une plage (ex: "2020-2021")
                    if (dateValue.includes('-')) {
                        const parts = dateValue.split('-');
                        if (parts[0].length === 4 && /^\d{4}$/.test(parts[0])) {
                            return `${parts[0]}-01-01`;
                        }
                    }
                    // Cas où la chaîne représente une année (ex: "2012")
                    if (/^\d{4}$/.test(dateValue)) {
                        return `${dateValue}-01-01`;
                    }
                    // Sinon, on essaie de créer un objet Date
                    const dateObj = new Date(dateValue);
                    if (!isNaN(dateObj.getTime())) {
                        return dateObj.toISOString().split('T')[0];
                    }
                }

                // En dernier recours, on retourne la date du jour
                return new Date().toISOString().split('T')[0];
            };


            // Création de la nouvelle entrée en utilisant directement les données du fichier JSON
            await Content.create({
                titre: serie.titre,
                original_title: serie.titre,  // Utilisez 'original_title' si présent sinon 'titre'
                description: serie.des,
                type: 'serie',
                release_date: parseReleaseDate(serie.date),
                saisons_possedees: serie.saisons,
                status: serie.status || 'released',  // Par défaut 'released' si le champ n'est pas défini
                added_date: new Date().toISOString().split('T')[0],
            });


            results.success++;
            results.imported.push(serie.titre);

        } catch (error) {
            results.failed++;
            results.errors.push(`${serie.titre}: ${error.message}`);
        }
    }

    // Génération du rapport d'importation
    const rapport = {
        date: new Date().toISOString(),
        total: series.length,
        ...results
    };

    const reportFile = `import-report-${Date.now()}.json`;
    fs.writeFileSync(reportFile, JSON.stringify(rapport, null, 2));

    return rapport;
}

module.exports = { importSeries };
