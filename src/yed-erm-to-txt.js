import fs from 'fs'
import cheerio from 'cheerio'
import _ from 'underscore'

_.mixin({
  sortKeysBy: function (obj, comparator) {
    var keys = _.sortBy(_.keys(obj), function (key) {
      return comparator ? comparator(obj[key], key) : key
    })

    return _.object(keys, _.map(keys, function (key) {
      return obj[key]
    }))
  }
})


export function graphmlFileToTxt(graphmlFile){
  const graphmlContent = fs.readFileSync(graphmlFile)
  return graphmlContentToTxt(graphmlContent)
}
export function graphmlContentToTxt(graphmlContent){
  const tables = {}

  const $ = cheerio.load(graphmlContent, {
      xmlMode: true,
  })

  $('[configuration="com.yworks.entityRelationship.big_entity"]').each(function(){

    const name = $(this).find('[configuration="com.yworks.entityRelationship.label.name"]').eq(0)
    const attributes = $(this).find('[configuration="com.yworks.entityRelationship.label.attributes"]').eq(0)
    const table = name.text()
    const columns = attributes.text()
    tables[table] = columns.split('\n')
  })

  const txt = []

  const orderedTables = _.sortKeysBy(tables)

  const columnsIndentation = '  '
  Object.entries(orderedTables).forEach(([table, columns])=>{

    const columnsBlock = []
    columns.forEach((column)=>{
      columnsBlock.push(columnsIndentation + column)
    })

    let columnsBlockStr = columnsBlock.join('\n')
    columnsBlockStr = columnsBlockStr.replace(/[\s]*$/g, '')

    txt.push(table)
    txt.push('')
    txt.push(columnsBlockStr)
    txt.push('-----------------------------------------------------')
  })


  return txt.join('\n')
}
