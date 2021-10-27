import * as https from 'https'
import * as querystring from 'querystring'
import * as crypto from 'crypto'
import { appid, appSecret } from './private'

export const translate = (word:string)  => {
  let from = 'en';
  let to = 'zh'
  if(/^[\\u4e00-\\u9fa5]$/.test(word[0])){
     from = 'zh';
     to = 'en'
  }
  const salt = Date.now().toString()
  const sign = crypto
  .createHash('md5')
  .update(`${appid}${word}${salt}${appSecret}`)
  .digest('hex')
  const query:string = new URLSearchParams({
    q: word,
    from: from,
    to: to,
    appid: appid,
    salt: salt,
    sign: sign,
  }).toString()
  const options = {
    hostname: 'fanyi-api.baidu.com',
    port: 443,
    path: '/api/trans/vip/translate?' + query,
    method: 'GET',

  }
  const req = https.request(options, (res) => {
    const chunks:Uint8Array[] = []
    
    res.on('data', (chunk) => {
      chunks.push(chunk)
    })
    res.on('end', () => {
      const string = Buffer.concat(chunks).toString()
      
      type BaiduResult = {
        error_code?: string;
        error_msg?: string 
        from: string;
        to: string;
        trans_result: {
          src: string;
          dst: string
        }[]
      }
      const object: BaiduResult = JSON.parse(string)

      if(object.error_code) {
        console.error(object.error_msg)
        process.exit(2)
      }
      object.trans_result.map(obj => {
        console.log(obj.dst + '\n')
      })
      process.exit(0)
    })
  })
  req.on('error', (e) => {
    console.log(e)
  })
  req.end()
}