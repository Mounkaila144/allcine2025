// app/components/Footer.tsx  (Make sure the file path is correct)
import { Film, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Import Button

export default function Footer() {
  return (
      <footer className="bg-background border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center">
                <Film className="h-8 w-8 text-red-500" /> {/* Red icon */}
                <span className="ml-2 text-xl font-bold">Allciné</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Votre destination pour les films, séries et produits informatiques de qualité.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-4">Navigation</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/client/contentClient" className="text-sm text-muted-foreground hover:text-red-500">
                    Film , Serie et Manga
                  </Link>
                </li>
                <li>
                  <Link href="/client/fidelite" className="text-sm text-muted-foreground hover:text-red-500">
                    Fideliter
                  </Link>
                </li>
                <li>
                  <Link href="/client/articles" className="text-sm text-muted-foreground hover:text-red-500">
                    Articles
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-4">Légal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-sm text-muted-foreground hover:text-red-500">
                    Mentions légales
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-sm text-muted-foreground hover:text-red-500">
                    Politique de confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-sm text-muted-foreground hover:text-red-500">
                    CGV
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-4">Contact</h3>
              <ul className="space-y-3"> {/* Increased spacing */}
                <li className="flex items-center text-sm text-muted-foreground">
                  <Button
                      variant="link"
                      className="p-0 text-muted-foreground hover:text-red-500 flex items-center"
                      asChild
                  >
                    <Link href="https://maps.google.com/?q=13.553904,2.130508" target="_blank" rel="noopener noreferrer">
                      <MapPin className="w-4 mr-2 text-red-500" /> {/* Red icon */}
                      Localité à Lazaret
                    </Link>
                  </Button>
                </li>
                <li className="flex items-center text-sm text-muted-foreground">
                  <Button
                      variant="link"
                      className="p-0 text-muted-foreground hover:text-red-500 flex items-center"
                      asChild
                  >
                    <Link href="https://maps.google.com/?q=13.588445,2.098003" target="_blank" rel="noopener noreferrer">
                      <MapPin className="w-4 mr-2 text-red-500" /> {/* Red icon */}
                      Localité à Référence
                    </Link>
                  </Button>
                </li>
                <li className="flex items-center text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 mr-2 text-red-500" /> {/* Red icon */}
                  +227 96801217  {/* Replace with your actual phone number */}
                </li>
                <li className="flex items-center text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 mr-2 text-red-500" /> {/* Red icon */}
                  contact@Allciné.fr {/*Replace with you actual email*/}
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t">
            <p className="text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} Allciné. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
  );
}