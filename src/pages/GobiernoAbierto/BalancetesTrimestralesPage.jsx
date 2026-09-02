import React from 'react'
import SectionLayout from '../../assets/components/SectionLayout'
import BalancetesView from '../../assets/components/GobiernoAbierto/BalancetesView'
import { DEFAULT_GOBIERNO_ABIERTO_SUBPAGES } from '../../data/GobiernoAbierto/cmsDefaults'
import { useCmsContent } from '../../lib/useCmsContent'

const BalancetesTrimestralesPage = () => {
  const content = useCmsContent('gobierno-abierto-balancetes', DEFAULT_GOBIERNO_ABIERTO_SUBPAGES.balancetes)
  return (
    <>
      <SectionLayout
        title={content.header?.title}
        highlight={content.header?.highlight}
        description={content.header?.description}
      />
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <BalancetesView data={content.data} />
      </div>
    </>
  )
}

export default BalancetesTrimestralesPage
