import type { Metadata } from "next";
import { Fill, LegalPage } from "@/components/LegalPage";
import { legal, site } from "@/lib/site";

export const metadata: Metadata = { title: "Conditions générales" };

export default function Conditions() {
  return (
    <LegalPage title="Conditions générales d’utilisation et de vente">
      <h2>1. Objet</h2>
      <p>
        Les présentes conditions encadrent l’utilisation de {site.name}, un service en ligne qui génère des clips courts
        à partir de vidéos longues, et la souscription à ses offres payantes. En créant un compte, vous les acceptez.
      </p>

      <h2>2. Compte</h2>
      <p>
        Vous devez avoir au moins 15 ans pour créer un compte. Vous êtes responsable de la confidentialité de votre mot
        de passe et des actions faites depuis votre compte.
      </p>

      <h2>3. Offres</h2>
      <p>
        {site.name} propose une offre Gratuite et des offres payantes Pro et Studio. Le contenu de chaque offre (minutes
        de vidéo par mois, qualité d’export, fonctionnalités) et son prix sont indiqués sur la page Tarifs au moment de
        la souscription. Les minutes non utilisées ne sont pas reportées sur le mois suivant.
      </p>

      <h2>4. Prix et paiement</h2>
      <p>
        Les prix sont indiqués en euros. Le paiement se fait par carte bancaire via Stripe, au début de chaque période
        (mensuelle ou annuelle). L’abonnement se renouvelle automatiquement à la fin de chaque période, sauf résiliation.
      </p>

      <h2>5. Résiliation</h2>
      <p>
        Vous pouvez résilier à tout moment depuis votre compte. La résiliation prend effet à la fin de la période déjà
        payée ; vous gardez l’accès à votre offre jusqu’à cette date. Aucun remboursement au prorata n’est effectué.
      </p>

      <h2>6. Droit de rétractation</h2>
      <p>
        Si vous êtes un consommateur, vous disposez de 14 jours à compter de la souscription pour vous rétracter, en
        nous écrivant à <Fill value={legal.email} />. Si vous commencez à utiliser l’offre payante pendant ce délai, vous
        demandez expressément que le service commence immédiatement ; en cas de rétractation, vous payez alors le
        montant correspondant au service fourni jusqu’à votre demande.
      </p>

      <h2>7. Vos vidéos</h2>
      <p>
        Vous ne devez importer que des vidéos dont vous détenez les droits ou pour lesquelles vous avez obtenu
        l’autorisation des ayants droit. Vous restez propriétaire de vos vidéos et de vos clips. Vous nous autorisez
        uniquement à les stocker et à les traiter dans le but de vous fournir le service.
      </p>
      <p>
        Il est interdit d’importer des contenus illégaux, haineux, violents, à caractère pornographique, ou qui portent
        atteinte aux droits d’autrui. Nous pouvons supprimer ces contenus et suspendre le compte concerné.
      </p>

      <h2>8. Fonctionnement du service</h2>
      <p>
        Les clips sont générés automatiquement par intelligence artificielle : leur choix, leur découpe et leurs
        sous-titres peuvent contenir des erreurs. Vérifiez-les avant de les publier. Nous faisons notre possible pour que
        le service soit disponible en permanence, sans pouvoir le garantir (maintenance, panne d’un prestataire).
      </p>

      <h2>9. Responsabilité</h2>
      <p>
        Vous êtes seul responsable des clips que vous publiez et de leur utilisation. Notre responsabilité ne peut être
        engagée qu’en cas de faute prouvée de notre part, et est limitée au montant payé au cours des 12 derniers mois.
      </p>

      <h2>10. Données personnelles</h2>
      <p>
        Voir notre <a href="/confidentialite">politique de confidentialité</a>.
      </p>

      <h2>11. Modification des conditions</h2>
      <p>
        Nous pouvons modifier ces conditions. En cas de changement important, vous serez prévenu par e-mail au moins 30
        jours à l’avance et pourrez résilier si vous n’êtes pas d’accord.
      </p>

      <h2>12. Litiges</h2>
      <p>
        Ces conditions sont soumises au droit français. En cas de litige, contactez-nous d’abord à{" "}
        <Fill value={legal.email} /> pour trouver une solution amiable. Si vous êtes un consommateur, vous pouvez aussi
        recourir gratuitement au médiateur de la consommation : <Fill value={legal.mediator} />.
      </p>
    </LegalPage>
  );
}
