import { Html, Head, Main, NextScript } from 'next/document'

const Document = () => {
  return (
    <Html>
      <Head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='' />
        <link href='https://fonts.googleapis.com/css2?family=Lora&display=swap' rel='stylesheet' />
        <link
          rel='stylesheet'
          href='https://unpkg.com/leaflet@1.9.2/dist/leaflet.css'
          integrity='sha256-sA+zWATbFveLLNqWO2gtiw3HL/lh1giY/Inf1BJ0z14='
          crossOrigin=''
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document
