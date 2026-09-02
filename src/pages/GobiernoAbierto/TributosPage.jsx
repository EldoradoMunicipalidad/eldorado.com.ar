import React from 'react'
import SectionLayout from '../../assets/components/SectionLayout'
import { Section } from '../../assets/components/Section'
import TributosDashboard from '../../assets/components/GobiernoAbierto/TributosDashboard'
import { DEFAULT_GOBIERNO_ABIERTO_SUBPAGES } from '../../data/GobiernoAbierto/cmsDefaults'
import { useCmsContent } from '../../lib/useCmsContent'

const TributosPage = () => {
  const content = useCmsContent('gobierno-abierto-tributos', DEFAULT_GOBIERNO_ABIERTO_SUBPAGES.tributos)
  return (
    <>
      <SectionLayout
        title={content.header?.title}
        highlight={content.header?.highlight}
        description={content.header?.description}
      />

      <Section>
        <TributosDashboard data={content.rows} totals={content.totals} />
      </Section>
    </>
  )
}

export default TributosPage
