import React from 'react'
import SectionLayout from '../../assets/components/SectionLayout'
import BalancetesView from '../../assets/components/GobiernoAbierto/BalancetesView'

const BalancetesTrimestralesPage = () => {
  return (
    <>
      <SectionLayout
        title="Balancetes"
        highlight="Trimestrales"
        description="Ejecución presupuestaria, Deuda Pública, Coparticipación, Resultado del Ejercicio"
      />
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <BalancetesView />
      </div>
    </>
  )
}

export default BalancetesTrimestralesPage
