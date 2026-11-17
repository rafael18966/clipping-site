import type { Metadata } from "next";
import { Fill, LegalPage } from "@/components/LegalPage";
import { legal, site } from "@/lib/site";

export const metadata: Metadata = { title: "Politique de confidentialité" };

export default function Confidentialite() {
  return (
    <LegalPage title="Politique de confidentialité">
      <p>
        Cette politique explique quelles données {site.name} collecte, pourquoi, combien de temps elles sont gardées et
        quels sont vos droits, conformément au Règlement général sur la protection des données (RGPD).
      </p>

      <h2>Responsable du traitement</h2>
      <p>
        <Fill value={legal.ownerName} />, joignable à l’adresse <Fill value={legal.email} />.
      </p>

      <h2>Données collectées</h2>
      <ul>
        <li>
          <strong>Compte</strong> : adresse e-mail et mot de passe (stocké sous forme chiffrée, jamais en clair).
        </li>
        <li>
          <strong>Contenus</strong> : les vidéos que vous importez, leur transcription et les clips générés.
        </li>
        <li>
          <strong>Paiement</strong> : géré par Stripe. Nous ne voyons ni ne stockons votre numéro de carte ; nous
          conservons uniquement l’état de votre abonnement et vos factures.
        </li>
        <li>
          <strong>Données techniques</strong> : adresse IP, type de navigateur et journaux de connexion, utilisés pour
          la sécurité et le bon fonctionnement du service.
        </li>
      </ul>

      <h2>Pourquoi nous les utilisons</h2>
      <ul>
        <li>Fournir le service (créer votre compte, traiter vos vidéos, générer vos clips) — exécution du contrat.</li>
        <li>Gérer votre abonnement et la facturation — exécution du contrat et obligations légales comptables.</li>
        <li>Sécuriser le service et prévenir les abus — intérêt légitime.</li>
        <li>Vous envoyer des informations sur le service (e-mails importants liés à votre compte) — exécution du contrat.</li>
      </ul>
      <p>Vos vidéos sont utilisées uniquement pour générer vos clips. Nous ne les vendons pas et ne les publions pas.</p>

      <h2>Durée de conservation</h2>
      <ul>
        <li>
          Vidéos sources importées : supprimées {legal.sourceVideoRetentionDays} jours après leur traitement.
        </li>
        <li>Clips générés et transcriptions : conservés tant que votre compte est actif, ou jusqu’à leur suppression.</li>
        <li>Compte : supprimé sur demande, ou après 3 ans d’inactivité.</li>
        <li>Factures : conservées 10 ans, comme l’exige la loi.</li>
      </ul>

      <h2>Prestataires</h2>
      <p>Pour faire fonctionner le service, nous faisons appel à des prestataires qui traitent des données pour notre compte :</p>
      <ul>
        <li>Vercel — hébergement du site.</li>
        <li>Supabase — comptes, base de données et stockage des fichiers.</li>
        <li>Railway — serveurs de traitement vidéo.</li>
        <li>Un service de transcription audio et un service d’intelligence artificielle — analyse de vos vidéos.</li>
        <li>Stripe — paiements.</li>
      </ul>
      <p>
        Certains de ces prestataires sont situés hors de l’Union européenne, notamment aux États-Unis. Ces transferts
        sont encadrés par les garanties prévues par le RGPD (décision d’adéquation ou clauses contractuelles types de la
        Commission européenne).
      </p>

      <h2>Cookies</h2>
      <p>
        Le site utilise uniquement des cookies nécessaires à son fonctionnement (par exemple pour vous garder connecté).
        Aucun cookie publicitaire ni de mesure d’audience n’est déposé. Si cela change, nous vous demanderons votre
        accord au préalable.
      </p>

      <h2>Vos droits</h2>
      <p>
        Vous pouvez à tout moment accéder à vos données, les corriger, les supprimer, en demander une copie
        (portabilité), vous opposer à leur traitement ou en demander la limitation. Écrivez-nous à{" "}
        <Fill value={legal.email} /> ; nous répondons sous un mois.
      </p>
      <p>
        Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL (cnil.fr).
      </p>
    </LegalPage>
  );
}
