import html2canvas from 'html2canvas'

const ExportImageButton = () => {
  const downloadCalendarImage = () => {
    const calendarElement = document.getElementById('wrapper')
    if (!calendarElement) return

    html2canvas(calendarElement).then(canvas => {
      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/jpeg')
      link.download = 'calendar.jpeg'
      link.click()
    })
  }

  return <button onClick={downloadCalendarImage}>Download Calendar</button>
}

export default ExportImageButton
