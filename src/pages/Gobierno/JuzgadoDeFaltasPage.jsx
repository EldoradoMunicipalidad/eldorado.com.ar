import { JuzgadoAccordion } from '../../assets/components/Gobierno/JuzgadoAccordion';
import SectionLayout from '../../assets/components/SectionLayout';
import { JUZGADO_DATA } from '../../data/Gobierno/secretariasData';

export const JuzgadoDeFaltasPage = () => {
    return (
        <>
            <SectionLayout
                title="Juzgado de"
                highlight="Faltas"
                description=""
            />

            <section className="bg-slate-50/50 py-10">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="space-y-4">
                        {JUZGADO_DATA.map((data, index) => (
                            <JuzgadoAccordion
                            id={data.id}    
                            key={index}
                                titulo={data.titulo}
                                icon={data.icon}
                                parrafo1={data.parrafo1}
                                parrafo2={data.parrafo2}
                                parrafo3={data.parrafo3}
                                Lista1={data.Lista1}
                                Lista2={data.Lista2}
                                Lista3={data.Lista3}
                                whatsapp={data.whatsapp}
                                email={data.email}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

export default JuzgadoDeFaltasPage