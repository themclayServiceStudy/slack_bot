/**
 *  동작 방식 -> slack bolt를 이용해서 API 호출
 */

const { App } = require('@slack/bolt'); // https://slack.dev/bolt-js/tutorial/getting-starteds
const express = require('express');
const bodyParser = require('body-parser');

// 사용자는 botToken과 secret만을 정의해서 구동할 수 있게 처리 -> slack bolt의 사용 객체로 정의하기 위함
const botToken = 'xoxb-5846047594821-5977040764706-xp6Js4LAHlRrWCwRBPS4ImcA';
const secret = '23c5e578402d768f0f067aa19f3e573a';

// App 객체 정의
const app = new App({
    token: botToken,
    signingSecret: secret,
});

// // 이벤트 처리
// app.message(async ({ message, say }) => {
//     try {
//         await say({
//             text: message.text,
//             channel: 'C05UAFAS2Q7'
//         });
//     } catch (error) {
//         console.log('Error bot say : ', error);
//     }
// });

// app.message(메세지 패턴, 콜백)
app.message(':wave:', async ({ message, say }) => { // message 메소드를 통해 메세지를 들음
    // 콘솔에 메시지 출력
    console.log(`Received message: ${message.text} from channel: ${message.channel}`);
  
    // 메시지를 발송 채널로 다시 전송
    await say(`Hello <@${message.user}> Received your message: ${message.text}`);
});

(async () => {
    try {
        await app.start(3001);
        console.log('⚡️ Bolt app is running!');
    } catch (error) {
        console.error('Error starting app:', error);
    }
})();


/**
 *  express 설정 -> 메세지 전송 api 
 */
const server = express();
server.use(bodyParser.json());

server.post('/send-message', async (req, res) => {
    try {
        const result = await app.client.chat.postMessage({
            token: botToken,
            channel: req.body.channel,
            text: req.body.text
        });

        res.json(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

server.listen(3000, () => {
    console.log('Express Server is running on port 3000');
});