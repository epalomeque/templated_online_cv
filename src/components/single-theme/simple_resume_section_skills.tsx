import React from 'react';
import AbilitiesInterface from '../../interfaces/abilities_info.ts'

interface SectionSkillsProps {
    SkillsData: AbilitiesInterface[] | undefined,
    TitleSection: string,
}

export default function SimpleResumeSectionSkills(props: SectionSkillsProps) {
  const {
    SkillsData,
    TitleSection,
  } = props;

  return <>
    <div className="section" key={ TitleSection }>
      <div className="section__title">{ TitleSection }</div>
      <div className="skills">
        <SkillsDataMap SkillsData={ SkillsData } />
      </div>
    </div>
  </>
}


/**
 * SkillsDataMap
 **/
interface SkillsDataMapProps {
    SkillsData: AbilitiesInterface[] | undefined,
}

function SkillsDataMap(props:SkillsDataMapProps) {
  const { SkillsData } = props;

  if (!SkillsData) return;

  return SkillsData.map((SkillsItemData: AbilitiesInterface, index: number) => {
    return <SkillsItem key={index} SkillsDataItem={ SkillsItemData } />
  });
}

/**
 * SkillsItem
 **/
interface SkillsItemProps {
    SkillsDataItem: AbilitiesInterface,
}

function SkillsItem(props: SkillsItemProps)  {
  const {
    SkillsDataItem: {
      id,
      name,
      level,
    },
  } = props;

  const itemId = `${name}_${id}`

  return (
      <div className="skills__item">
        <div className="left"><div className="name">{ name }</div></div>
        <div className="right">
          <LevelInputs level={ level } itemId={ itemId } />
         </div>
        </div>
  )
}

/**
 * LevelInputs
 **/
interface LevelInputsProps {
    level: number,
    itemId: string,
}

function LevelInputs(props: LevelInputsProps) {
  const {
    level,
    itemId,
  } = props;

  const MAX_SKILL_LEVEL = 10;
  const lvlArray = [];
  for (let lvl=0; lvl < level; lvl++ ) {
    lvlArray.push({
      idNumber: lvl,
      isChecked: true,
      itemId: itemId,
    })
  }

  if (level < 10) {
    for (let lvl=0; lvl < (MAX_SKILL_LEVEL-level); lvl++ ) {
      lvlArray.push({
        idNumber: lvl,
        isChecked: false,
        itemId: itemId,
      })
    }
  }

  return lvlArray.map(( { ...item }, index ) => {
      return <React.Fragment key={index}>
        <input id={ `${item.itemId}_ck${item.idNumber}` } type="checkbox" checked={ item.isChecked } readOnly={ true } />
        <label htmlFor={ `${itemId}_ck${item.idNumber}` }></label>
      </React.Fragment>
  });
}
