import SailSimulator from '../components/sail/SailSimulator'
import { PageHeader, Accordion, AccordionItem, Term } from '../components/ui'
import { Sailboat, Waves, Anchor, Route } from 'lucide-react'

export default function Teoria() {
  return (
    <div>
      <PageHeader eyebrow="Teoria żeglowania" title="Wiatr, kurs i trym żagli">
        Żaglówka nie płynie „popychana” przez wiatr — na większości kursów żagiel
        działa jak <Term label="skrzydło" title="Żagiel jako skrzydło">
          <p>
            Opływający żagiel wiatr przyspiesza po stronie zawietrznej (wypukłej),
            co obniża tam ciśnienie. Powstaje <b>siła nośna</b> prostopadła do
            żagla — tak samo jak na skrzydle samolotu. Dlatego jacht potrafi płynąć
            pod ostrym kątem do wiatru.
          </p>
        </Term>. Poniżej zmieniaj kierunek wiatru i kurs jachtu — żagle same
        ustawią się w optymalnej pozycji, a strzałki pokażą działające siły.
      </PageHeader>

      <SailSimulator />

      {/* Teoria rozszerzona */}
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 font-display text-2xl font-700 text-white">
            Kursy względem wiatru
          </h2>
          <Accordion>
            <AccordionItem id="k1" title="Martwy kąt (łopot)" icon={<Anchor className="h-5 w-5" />}>
              <p>
                Sektor ok. ±30–45° po obu stronach linii wiatru, w którym żaglówka
                nie może płynąć. Żagle łopoczą (tracą siłę nośną), jacht wytraca
                prędkość. Aby „iść pod wiatr”, trzeba płynąć zygzakiem —{' '}
                <Term label="halsować" title="Halsowanie (beidewind zygzakiem)">
                  <p>
                    Płynięcie kursem ostrym raz na jednym, raz na drugim halsie,
                    z wykonywaniem <b>zwrotów przez sztag</b>, aby dotrzeć do celu
                    leżącego pod wiatr. Wypadkowa trasa przypomina zygzak.
                  </p>
                </Term>.
              </p>
            </AccordionItem>
            <AccordionItem id="k2" title="Bajdewind (ostry)" icon={<Route className="h-5 w-5" />}>
              <p>
                Wiatr ok. 45° od dziobu. Żagle wybrane niemal do osi jachtu. Duża
                siła przechylająca, wyraźny dryf, ale to jedyny sposób na
                zbliżanie się do celu położonego pod wiatr.
              </p>
            </AccordionItem>
            <AccordionItem id="k3" title="Półwiatr" icon={<Sailboat className="h-5 w-5" />}>
              <p>
                Wiatr z boku (ok. 90°). Zwykle najszybszy i najbezpieczniejszy
                kurs. Żagle wypuszczone mniej więcej do połowy, siła ciągu duża,
                przechył umiarkowany.
              </p>
            </AccordionItem>
            <AccordionItem id="k4" title="Baksztag" icon={<Waves className="h-5 w-5" />}>
              <p>
                Wiatr zza trawersu (ok. 135°). Kurs pełny, komfortowy. Żagle
                wypuszczone szeroko. Wiatr pozorny słabnie, bo jacht „ucieka” przed
                wiatrem.
              </p>
            </AccordionItem>
            <AccordionItem id="k5" title="Fordewind (z wiatrem)" icon={<Waves className="h-5 w-5" />}>
              <p>
                Wiatr prosto w rufę. Żagle wypuszczone maksymalnie, działa głównie
                <b> opór</b>, nie siła nośna. Uwaga na{' '}
                <Term label="niekontrolowany zwrot przez rufę" title="Mimowolny zwrot przez rufę (gejba)">
                  <p>
                    Gdy wiatr przejdzie na drugą stronę rufy, bom gwałtownie
                    przerzuca się na przeciwną burtę. Grozi to urazem głowy i
                    uszkodzeniem takielunku. Na fordewindzie płyń uważnie i
                    kontroluj bom szotem.
                  </p>
                </Term>.
              </p>
            </AccordionItem>
          </Accordion>
        </div>

        <div>
          <h2 className="mb-4 font-display text-2xl font-700 text-white">
            Kluczowe pojęcia
          </h2>
          <div className="card p-6 space-y-4 text-sm leading-relaxed text-brine-100/85">
            <p>
              <b className="text-white">Trym żagla</b> — ustawienie żagla względem
              wiatru za pomocą <Term label="szotów" title="Szoty">
                <p>Liny do wybierania i luzowania żagli. Grotszot steruje grotem, foka‑szoty fokiem.</p>
              </Term>. Reguła: luzuj żagiel aż zacznie łopotać na przednim liku, potem lekko wybierz.
            </p>
            <p>
              <b className="text-white">Przechył i dryf</b> — im ostrzej do wiatru,
              tym większa siła boczna. Kil/miecz zamienia ją częściowo na ruch do
              przodu, resztę oddajemy jako dryf.
            </p>
            <p>
              <b className="text-white">Wiatr pozorny</b> — to on decyduje o
              trymie. Na szybkich kursach „skręca” ku dziobowi, więc żagle wybieramy
              nieco mocniej, niż sugerowałby wiatr rzeczywisty.
            </p>
            <p>
              <b className="text-white">Ster</b> — jacht dobrze wytrymowany ma lekką{' '}
              <Term label="tendencję zaostrzania" title="Ster nawietrzny">
                <p>
                  Lekki nacisk na rumpel „pod wiatr”. Jest bezpieczny — po
                  puszczeniu steru jacht sam staje dziobem do wiatru i wytraca
                  prędkość.
                </p>
              </Term>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
