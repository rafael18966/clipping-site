import type { Metadata } from "next";
import { Fill, LegalPage } from "@/components/LegalPage";
import { legal, site } from "@/lib/site";

export const metadata: Metadata = { title: "Mentions légales" };

export default function MentionsLegales() {
  return (
    <LegalPage title="Mentions légales">
      <h2>Éditeur du site</h2>
      <p>
        Le site {site.name} ({site.url}) est édité par <Fill value={legal.ownerName} />, <Fill value={legal.status} />.
      </p>
      <ul>
        <li>
          SIRET : <Fill value={legal.siret} />
        </li>
        <li>
          Adresse : <Fill value={legal.address} />
        </li>
        <li>
          E-mail : <Fill value={legal.email} />
        </li>
        {legal.vatNote && <li>{legal.vatNote}</li>}
      </ul>
      <p>
        Directeur de la publication : <Fill value={legal.ownerName} />.
      </p>

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis — vercel.com.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        Les textes, le logo, l’interface et le code du site sont la propriété de l’éditeur. Toute reproduction sans
        autorisation est interdite. Les vidéos importées par les utilisateurs restent leur propriété.
      </p>

      <h2>Données personnelles</h2>
      <p>
        Le traitement de vos données est décrit dans notre <a href="/confidentialite">politique de confidentialité</a>.
      </p>

      <h2>Contact</h2>
      <p>
        Pour toute question : <Fill value={legal.email} />.
      </p>
    </LegalPage>
  );
}
