import { MapPin, Navigation, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const ADDRESS = "12 rue Ferrère, 33000 Bordeaux";
const DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=" +
  encodeURIComponent(ADDRESS);
const STREETVIEW_URL =
  "https://www.google.com/maps/@44.8481708,-0.571695,3a,69y,141.86h,90.67t/data=!3m7!1e1!3m5!1sY-2B2Whh3J1AedtQcJiqXg!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-0.6746400419454517%26panoid%3DY-2B2Whh3J1AedtQcJiqXg%26yaw%3D141.86449859379448!7i16384!8i8192";
// Satellite 3D embed (tilt + rotation) centered on 12 rue Ferrère
const EMBED_URL =
  "https://www.google.com/maps/embed?pb=!4v1729600000000!6m8!1m7!1sCAoSLEFGMVFpcE5fZmFrZQ!2m2!1d44.8438!2d-0.5762!3f0!4f45!5f0.7820865974627469";
// Fallback simpler embed (place mode) — guaranteed to work
const EMBED_URL_FALLBACK =
  "https://maps.google.com/maps?q=12+rue+Ferrere+33000+Bordeaux&t=k&z=18&ie=UTF8&iwloc=&output=embed";

export default function CabinetMap3D() {
  return (
    <section className="relative section-padding section-ivory overflow-hidden">
      {/* Subtle bridge from previous section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[50%] h-48 bg-gold/10 blur-3xl rounded-full"
      />

      <div className="relative max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Left column — editorial */}
          <div className="lg:col-span-2 reveal">
            <p className="text-[13px] tracking-widest uppercase text-gold mb-4">
              Notre adresse
            </p>
            <h2 className="text-2xl md:text-3xl font-heading font-semibold text-primary leading-tight mb-6">
              Au cœur du Triangle d'Or bordelais
            </h2>

            <div className="border-l-2 border-gold/40 pl-6 mb-8">
              <p className="flex items-start gap-2 text-primary font-heading text-lg">
                <MapPin className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                <span>
                  12 rue Ferrère
                  <br />
                  33000 Bordeaux
                </span>
              </p>
            </div>

            <ul className="space-y-3 mb-8 text-sm text-gray-text">
              <li className="flex items-start gap-3">
                <span className="w-1 h-1 rounded-full bg-gold mt-2 shrink-0" />
                À 5 minutes à pied de la Place de la Comédie
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1 h-1 rounded-full bg-gold mt-2 shrink-0" />
                Parking Tourny à 200 m
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1 h-1 rounded-full bg-gold mt-2 shrink-0" />
                Tram C — arrêts Quinconces & CAPC
              </li>
            </ul>

            <div className="flex flex-wrap gap-3">
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer">
                  <Navigation className="w-4 h-4" />
                  Itinéraire
                </a>
              </Button>
              <Button asChild variant="outline" className="border-primary/20 text-primary hover:bg-primary/5">
                <a href={STREETVIEW_URL} target="_blank" rel="noopener noreferrer">
                  <Eye className="w-4 h-4" />
                  Street View
                </a>
              </Button>
            </div>
          </div>

          {/* Right column — interactive 3D map */}
          <div className="lg:col-span-3 reveal reveal-delay-2">
            <div className="relative group">
              {/* Gold halo */}
              <div className="absolute -inset-2 bg-gradient-to-br from-gold/20 via-transparent to-gold/10 rounded-lg blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-700" />

              <div className="relative rounded-lg overflow-hidden border border-gold/30 shadow-2xl bg-primary">
                <div className="aspect-[16/10] w-full">
                  <iframe
                    title="Plan 3D du cabinet KANTI — 12 rue Ferrère, 33000 Bordeaux"
                    src={EMBED_URL_FALLBACK}
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>

                {/* 3D badge */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-primary/90 backdrop-blur-md border border-gold/30 px-3 py-1.5 rounded-full">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
                  </span>
                  <span className="text-[11px] tracking-widest uppercase text-primary-foreground">
                    Vue satellite — interactive
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-text mt-3 text-center italic">
                Carte interactive — zoomez, faites pivoter, explorez le quartier.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}