const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')

dayjs.extend(utc)

module.exports = {
  skip: true, // NOTE: return an HTTP error 503 (Service Unavailable) on every request from GitHub server only (https://github.com/iptv-org/epg/issues/1172#issuecomment-1284261669)
  site: 'tvtv.us',
  url: function ({ date, channel }) {
    return `https://www.tvtv.us/api/v1/lineup/USA-NY71652-DEFAULT/grid/${date.toJSON()}/${date
      .add(1, 'd')
      .toJSON()}/${channel.site_id}`
  },
  parser: function ({ content }) {
    let programs = []

    const items = parseItems(content)
    items.forEach(item => {
      const start = dayjs.utc(item.startTime)
      const stop = start.add(item.runTime, 'm')
      programs.push({
        title: item.title,
        description: item.subtitle,
        start,
        stop
      })
    })

    return programs
  }
}

function parseItems(content) {
  const json = JSON.parse(content)
  if (!json.length) return []
  return json[0]
}
