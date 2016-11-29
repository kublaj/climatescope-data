const csvParse = require('csv-parse')
const fs = require('fs')
const baseData = require('./tmp/ne10.json')

csvParse(fs.readFileSync('../source/meta/admin_areas.csv'), {columns:true}, function(err, output) {
  // Map the Natural Earth GeoJSON and modify the properties
  var finalFeatures = baseData.features.map(f => {
    // Check if the feature is a Climatescope country
    let i = output
      .map(o => o.iso.toLowerCase())
      .findIndex(o => o === f.properties.ISO_A2.toLowerCase())
    if (i > -1) {
      f.properties = {
        'cs': 1,
        'iso': output[i].iso.toLowerCase(),
        'region': output[i].region
      }
    } else {
      f.properties = {
        'cs': 0,
        'iso': f.properties.ISO_A2.toLowerCase(),
        'region': null
      } 
    }
    return f
  })

  var finalData = {
    "type": "FeatureCollection",
    "features": finalFeatures
  }

  fs.writeFileSync('./tmp/climatescope-basemap-data.json', JSON.stringify(finalData))
})