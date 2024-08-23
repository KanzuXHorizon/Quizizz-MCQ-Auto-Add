let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;
let lastUpdateTime = performance.now();
let popupContainerClicked = false;
let previewContainerClicked = false; 

function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

function Create_Preview() {
    const root = document.createElement('style');
    root.innerHTML = `
        :root {
            --primary-color: #4CAF50;
            --secondary-color: #45a049;
            --background-color: #f0f0f0;
            --text-color: #333;
            --border-color: #ddd;
        }
        body {
            color: white;
            font-family: "Fira Sans";
        }
        @keyframes colorChange {
            0% {
                color: white;
            }
            50% {
                color: red;
            }
            100% {
                color: yellow;
            }
        }
        .previewContainer {
            margin: auto;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            justify-content: center;
            display: flex;
            position: fixed;
            align-items: center;
        }
        .previewContent {
            background-image: url(https://cf.quizizz.com/themes/v2/classic/bg_image.jpg);
            width: 100%;
            height: 100%;
            max-width: 1000px;
            padding: 20px;
            max-height: 560px;
            border-radius: 20px;
            overflow-y: auto;
            text-align: center;
        }
        .previewName {
            font-size: 30px;
            padding: 20px;
            width: fit-content;
            margin: 0 auto;
            animation: colorChange 5s infinite alternate;
            font-weight: bold;
        }
        .Question {
            padding: 20px;
            margin-top: 16px;
            background-color: hsl(0deg 0% 3.5% / 50%) !important;
            -webkit-backdrop-filter: blur(10px);
            backdrop-filter: blur(10px);
            border: 1px solid rgb(255 255 255 / 10%) !important;
            border-radius: 10px;
            font-size: 20px;
            width: 100%;
            word-wrap: break-word;
            max-width: 900px;
            margin: 0 auto;
            text-align: center;
            overflow-y: auto;   
        }
        .Answer {
            display: flex;
            justify-content: space-between;
            max-width: 900px;
            align-items: center;
            margin: 0 auto;
        }
        button:not(:last-child) {
            margin-right: 5px;
        }
        .Quiz {
            margin-top: 20px;
        }
        .btn1 {
            flex: 1;
            padding: 10px;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 20px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            margin-top: 10px;
            transform: scale(1);
            max-width: 210px;
            height: 200px;
            overflow-y: auto;
            background-color: hsl(208.8deg 95.8% 46.9%);
        }
        .btn2 {
           flex: 1;
            padding: 10px;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 20px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            margin-top: 10px;
            transform: scale(1);
            max-width: 210px;
            height: 200px;
            overflow-y: auto;
            background-color: rgb(0 179 195);
        }
        .btn3 {
           flex: 1;
            padding: 10px;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 20px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            margin-top: 10px;
            transform: scale(1);
            max-width: 210px;
            height: 200px;
            overflow-y: auto;
            background-color: rgb(255 165 0);
        }
        .btn4 {
           flex: 1;
            padding: 10px;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 20px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            margin-top: 10px;
            transform: scale(1);
            max-width: 210px;
            height: 200px;
            overflow-y: auto;
            background-color: rgb(248 84 126);
        }
        .CountQ {
            font-size: .875rem;
            border: 2px solid rgb(255 255 255 / 10%) !important;
            width: fit-content;
            max-width: fit-content;
            margin: 0 auto;
            border-radius: 20px;
            padding-top: .25rem;
            padding-bottom: .25rem;
            padding-left: .75rem;
            padding-right: .75rem;
            background-color: rgb(9 9 9 / 50%);
            position: relative;
            z-index: 3;
            margin-bottom: -11px;
        }
    `;
    document.head.appendChild(root);

    const previewContainer = document.createElement('div');
        previewContainer.onclick = function () {
            popupContainerClicked = true;
        }
        previewContainer.classList.add('previewContainer');

    const previewContent = document.createElement('div');
        previewContent.onclick = function () {
            popupContainerClicked = true;
        }
        previewContent.classList.add('previewContent');

    const barDiv = document.createElement('div');
        barDiv.style.display = 'flex';
        barDiv.onclick = function () {
            popupContainerClicked = true;
        }
    previewContent.appendChild(barDiv);

    const previewAnswer = document.createElement('button');
        previewAnswer.style.padding = '20px';
        previewAnswer.style.backgroundColor = 'white';
        previewAnswer.style.color = 'black'
        previewAnswer.innerHTML = 'Xem đáp án';
        previewAnswer.onclick = function() {
            const Correct = document.getElementsByClassName('TheCorrectAnswer');
            const Incorrect = document.getElementsByClassName('TheIncorrectAnswer');
            if (Correct[0].style.backgroundColor == 'green') {
                previewAnswer.innerHTML = 'Xem đáp án';
                for (let i = 0; i < Correct.length; i++) {
                    Correct[i].className.includes('btn1') ? Correct[i].style.backgroundColor = 'hsl(208.8deg 95.8% 46.9%)' : Correct[i].className.includes('btn2') ? Correct[i].style.backgroundColor = 'rgb(0 179 195)' : Correct[i].className.includes('btn3') ? Correct[i].style.backgroundColor = "rgb(255 165 0)" : Correct[i].style.backgroundColor = 'rgb(248 84 126)';
                }
                for (let i = 0; i < Incorrect.length; i++) {
                    Incorrect[i].className.includes('btn1') ? Incorrect[i].style.backgroundColor = 'hsl(208.8deg 95.8% 46.9%)' : Incorrect[i].className.includes('btn2') ? Incorrect[i].style.backgroundColor = 'rgb(0 179 195)' : Incorrect[i].className.includes('btn3') ? Incorrect[i].style.backgroundColor = "rgb(255 165 0)" : Incorrect[i].style.backgroundColor = 'rgb(248 84 126)';
                }
            }
            else {
                previewAnswer.innerHTML = 'Ẩn đáp án'
                for (let i = 0; i < Correct.length; i++) {
                    Correct[i].style.backgroundColor = 'green'
                }
                for (let i = 0; i < Incorrect.length; i++) {
                    Incorrect[i].style.backgroundColor = 'black'
                }
            }
        }
        previewAnswer.style.borderRadius = '20px'
        barDiv.appendChild(previewAnswer)

    const previewName = document.createElement('div');
        previewName.classList.add('previewName');
        previewName.id = 'previewName_';
        previewName.textContent = 'BẢN XEM TRƯỚC | CÓ:  CÂU';
        barDiv.appendChild(previewName)

    const previewClose = document.createElement('button');
        previewClose.style.padding = '20px';
        previewClose.style.backgroundColor = 'white';
        previewClose.style.color = 'black'
        previewClose.innerHTML = 'Đóng xem trước';
        previewClose.onclick = function() {
            document.body.removeChild(previewContainer);
        }
        previewClose.style.borderRadius = '20px'
    barDiv.appendChild(previewClose)

    const quizContainer = document.createElement('div');
        quizContainer.onclick = function () {
            popupContainerClicked = true;
        }
        quizContainer.classList.add('Quiz-container');

    const createQuiz = (id, count, question, answers, correct) => {
        const quiz = document.createElement('div');
        quiz.classList.add('Quiz');
        quiz.setAttribute('id', id);

        const quizCount = document.createElement('div');
        quizCount.classList.add('CountQ');
        quizCount.textContent = count;

        const quizQuestion = document.createElement('div');
        quizQuestion.classList.add('Question');
        quizQuestion.innerHTML = question;

        const answerContainer = document.createElement('div');
        answerContainer.classList.add('Answer');

        answers.forEach((answerText, index) => {
            const button = document.createElement('button');
            button.classList.add(`btn${index + 1}`);
            button.innerHTML = answerText;
            if (index === correct) button.classList.add('TheCorrectAnswer');
            else button.classList.add('TheIncorrectAnswer');
            answerContainer.appendChild(button);
        });

        quiz.appendChild(quizCount);
        quiz.appendChild(quizQuestion);
        quiz.appendChild(answerContainer);

        return quiz;
    };
    return { createQuiz,quizContainer,previewContent,previewContainer };
}

function Create_Interface() {
    const snackbar = document.createElement("div");
        snackbar.id = "snackbar";

        snackbar.style.left = "50%";
        snackbar.style.transform = "translate(-50%, 0)";
        snackbar.style.visibility = "hidden";
        snackbar.style.minWidth = "250px";
        snackbar.style.margin = "0 5px 0 5px";
        snackbar.style.backgroundColor = "#333";
        snackbar.style.color = "#fff";
        snackbar.style.textAlign = "center";
        snackbar.style.borderRadius = "2px";
        snackbar.style.padding = "16px";
        snackbar.style.position = "fixed";
        snackbar.style.zIndex = "1";
        snackbar.style.bottom = "30px";
    document.body.appendChild(snackbar);

    function Notification (Msg) {
        snackbar.innerHTML = Msg;
        snackbar.style.visibility = 'visible'
        setTimeout(() => {
            snackbar.style.visibility = 'hidden'
        }, 3000)
    }

    const Styles = document.createElement('style');
        Styles.textContent = Css();
    document.head.appendChild(Styles);


    const popupContainer = document.createElement('div');
        popupContainer.classList.add('popup-container');
        popupContainer.textContent = 'Auto';
        popupContainer.id = 'popup-container';

    const contentContainer = document.createElement('div');
        contentContainer.className = "content-container";
    
    const popupContent = document.createElement('div');
        popupContent.classList.add('popup-content');
        popupContent.id = 'popup-content';

    let h1 = document.createElement('h1');
        h1.textContent = "Tuỳ Chỉnh Tự Động"
    popupContent.appendChild(h1);

    let divStatus = document.createElement('div');
        divStatus.style.display = 'flex'
    popupContent.appendChild(divStatus);

    let count = document.createElement('p');
        count.innerHTML = "Đã Thêm: 0";
        count.id = 'Count';
        count.className = 'p2';
        count.style.width = '200px';
        count.style.fontSize = '24px';
        count.style.width = '300px'
        count.style.marginRight = '18px';
        count.style.marginTop = '10px'
    divStatus.appendChild(count);


    let Status = document.createElement('p');
        Status.id = 'Status';
        Status.innerHTML = "Trạng Thái: Chưa Xong";
        Status.className = 'p2';
        Status.style.color = 'red';
        Status.style.fontSize = '24px';
        Status.style.marginTop = '10px';
        Status.style.marginLeft = '0px';
        Status.style.width = '300px';
    divStatus.appendChild(Status);

    let min = document.createElement('input');
        min.placeholder = "Hãy nhập thời gian vô đây (số 1 = 1 phút, 2 = 2 phút)";
        min.className = 'timer';
        min.id = "timer"
    popupContent.appendChild(min);

    let p = document.createElement('p');
        p.innerHTML = `Hãy nhập câu hỏi và câu trả lời vào hộp ở dưới, lưu ý là câu hỏi phải có câu trả lời và được đánh dấu = dấu *, ví dụ "A. 132, *B. 133,... trong đó B là câu đúng do có dấu * trước câu.Những câu bị thiếu đáp án sẽ được thông báo sau khi xong, mặc định đáp án của mấy câu thiếu là A.`
        p.className = "p2";
    popupContent.appendChild(p);

    let textarea = document.createElement('textarea');
        textarea.id = "DataCuaKanzu";
        textarea.spellcheck = false;
        textarea.className = "inputbox";
        textarea.placeholder = 'Hãy nhập câu trắc nghiệm bạn cần tự động thêm!';
    popupContent.appendChild(textarea);


    let btn_preview = document.createElement('button');
        btn_preview.className = 'htcuu';
        btn_preview.id = 'PreviewNe';
        btn_preview.innerHTML = "Xem trước kết quả";
        btn_preview.style.margin = '0 auto';
        btn_preview.style.marginRight = '18px'
    popupContent.appendChild(btn_preview);
    let btn = document.createElement('button');
        btn.id = "SubmitCuaKanzu";
        btn.className='htcuu';
        btn.innerHTML = "Tự Động Thêm";
    popupContent.appendChild(btn);

    new MovementAndDisplay(popupContainer,popupContent,contentContainer)
    document.body.appendChild(popupContainer);
    contentContainer.appendChild(popupContent);
    document.body.appendChild(contentContainer);

    document.getElementById('PreviewNe').addEventListener('click', async function(e) {
        e.preventDefault();
        const createQ = Create_Preview();
        const Data = ParseMCQ();
        for(let i =1 ; i< (Data.length + 1); i ++) {
            createQ.quizContainer.appendChild(createQ.createQuiz(i, `${i}/${(Data.length)}`, Data[i - 1].Question, Data[i - 1].Answer,Data[i - 1].Correct));
        }
        createQ.previewContent.appendChild(createQ.quizContainer);
        createQ.previewContainer.appendChild(createQ.previewContent);
        document.body.appendChild(createQ.previewContainer);
        document.getElementById('previewName_').textContent = `BẢN XEM TRƯỚC | CÓ: ${Data.length} CÂU`;
    })
    
    document.getElementById('SubmitCuaKanzu').addEventListener('click', async function(e) {
        e.preventDefault();
        const obj = ParseMCQ();
        const error_aw = [];
        var x = 0;
        for (let i of obj) {
            x++;
            if (i.Correct == undefined) {
                error_aw.push(i.Question)
            }

            var version = await fetch("https://quizizz.com/_quizserver/main/v2/quiz/" + location.href.split('/')[5] + "?convertQuestions=false&sanitize=read", {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "en-US,en;q=0.9,vi;q=0.8",
                    "sec-ch-ua": "\"Brave\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "sec-gpc": "1",
                    "x-component-type": "adminv3",
                },
                "referrer": location.href,
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
            });
            var parse = await version.json();

            const requestBody = {
                "_id": location.href.split('/')[5],
                "type": "MCQ",
                "time": (parseInt(document.getElementById('timer').innerHTML) ?  parseInt(document.getElementById('timer').innerHTML) * 60 * 1000 : 2 * 60 * 1000),
                "structure": {
                "kind": "MCQ",
                "options": [
                    {
                    "_id": "661d74e21ad4f058edd13f3a",
                    "math": {
                        "latex": [],
                        "template": null
                    },
                    "type": "text",
                    "hasMath": false,
                    "media": [],
                    "text": i.Answer[0]
                    },
                    {
                    "_id": "661d74e21ad4f058edd13f3b",
                    "math": {
                        "latex": [],
                        "template": null
                    },
                    "type": "text",
                    "hasMath": false,
                    "media": [],
                    "text": i.Answer[1]
                    },
                    {
                    "_id": "661d74e21ad4f058edd13f3c",
                    "math": {
                        "latex": [],
                        "template": null
                    },
                    "type": "text",
                    "hasMath": false,
                    "media": [],
                    "text": i.Answer[2]
                    },
                    {
                    "_id": "661d74e21ad4f058edd13f3d",
                    "math": {
                        "latex": [],
                        "template": null
                    },
                    "type": "text",
                    "hasMath": false,
                    "media": [],
                    "text":  i.Answer[3]
                    }
                ],
                "settings": {
                    "hasCorrectAnswer": true,
                    "fibDataType": "string",
                    "canSubmitCustomResponse": false,
                    "doesOptionHaveMultipleTargets": false
                },
                "marks": {
                    "correct": 20,
                    "incorrect": 0
                },
                "query": {
                    "answerTime": -1,
                    "math": {
                    "latex": [],
                    "template": null
                    },
                    "type": null,
                    "hasMath": false,
                    "media": [],
                    "text": i.Question,
                    "_id": parse.data.draft._id
                },
                "explain": {
                    "math": {
                    "latex": [],
                    "template": null
                    },
                    "type": "",
                    "hasMath": false,
                    "media": [],
                    "text": ""
                },
                "theme": {
                    "titleFontFamily": "Quicksand",
                    "fontFamily": "Quicksand",
                    "fontColor": {
                    "text": "#5D2057"
                    },
                    "background": {
                    "color": "#FFFFFF",
                    "image": "",
                    "video": ""
                    },
                    "shape": {
                    "largeShapeColor": "#F2F2F2",
                    "smallShapeColor": "#9A4292"
                    }
                },
                "graphs": [],
                "hints": [],
                "order": "asc",
                "hasMath": false,
                "answer":  i.Correct != undefined ? i.Correct : 0,
                "media": {},
                "elements": []
                },
                "index": 1,
                "startedAt": "",
                "v": 0,
                "clones": [],
                "published": false,
                "deleted": false,
                "isSuperParent": false,
                "metaData": {},
                "topics": [],
                "standards": [],
                "marksUpdated": false,
                "quizId": location.href.split('/')[5],
                "aiMeta": {}
            };
            
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8',
                    'Content-Type': 'application/json',
                    'sec-ch-ua': '"Brave";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-origin',
                    'sec-gpc': '1',
                    'x-component-type': 'adminv3',
                },
                referrer: location.href,
                referrerPolicy: 'strict-origin-when-cross-origin',
                body: JSON.stringify(requestBody),
                mode: 'cors',
                credentials: 'include'
            };
            
            await fetch('https://quizizz.com/_quizserver/main/v2/version/' + parse.data.draft._id+ '/question', requestOptions)
            document.getElementById('Count').innerHTML = 'Đã Thêm: ' +  x
            Notification("Đã thêm được: "+ x);
        }
        document.getElementById('Status').innerHTML = "Trạng Thái: Đã Xong | Nhấn F5 để xem đầy đủ câu hỏi đã thêm";
        alert("Đã Hoàn Thành!");
        if (error_aw.length != 0) {
            alert('NHỮNG CÂU SAU BỊ THIẾU ĐÁP ÁN:\n' + error_aw.join('\n'));
        }
        alert('Nhấn f5 để reload lại trang và thấy câu hỏi đã thêm!!')
    })

}


function MovementAndDisplay(popupContainer,popupContent,contentContainer) {
    popupContainer.addEventListener('click', () => {
        popupContainerClicked = true;
        contentContainer.style.display = 'block';
    });
        
    popupContent.addEventListener('click', () => {
        popupContainerClicked = true;
    });
        
    document.addEventListener('click', (event) => {
        if (!popupContainerClicked && event.target !== popupContainer && event.target !== popupContent) {
            contentContainer.style.display = 'none';
        }
        popupContainerClicked = false;
    });


    function initDragAndDropEvents() {
        popupContainer.addEventListener('mousedown', dragStart);
        popupContainer.addEventListener('mouseup', dragEnd);
        popupContainer.addEventListener('mousemove', drag);
    }

    initDragAndDropEvents();

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === popupContainer) {
            isDragging = true;
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;

        isDragging = false;
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }

    function drag(e) {
        if (isDragging) {
            const currentTime = performance.now();
            const deltaTime = currentTime - lastUpdateTime;
            if (deltaTime >= 16) {
                e.preventDefault();
                if (e.target === popupContainer) {
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                    xOffset = currentX;
                    yOffset = currentY;
                    requestAnimationFrame(() => setTranslate(currentX, currentY, popupContainer));
                    lastUpdateTime = currentTime;
                }
            }
        }
    }


}

function ParseMCQ() {
    const Data = document.getElementById('DataCuaKanzu').value;
        
        var t = Data.split('\n');
        const obj = [];
        var format = {
            Question: "",
            Answer: [],
            Correct: 0
        }
        var tempMathCheck = {
            Injection: {
                Index: 0,
                Status: false,
                Section: 'A'
            },
            Answer: 0,
            Index: 0, // 1,2,3,4
            currentSection: "A",
            A: [],
            B: [],
            C: [],
            D: []
        };        
        var ii = 1
        var appendChild = '';
        for (let i = 0; i < t.length; i++) {
            if (ii === 1) { 
                if (t[i + 1] && !t[i + 1].includes("A. ")) {
                    if (t[i].length < 3) continue;//\n happen
                    if (t[i].includes("<")) appendChild = appendChild + ' ' + (t[i]).replace(RegExp('\n','g'), '').replace('math xmlns="http://www.w3.org/1998/Math/MathML" display="block"', 'math xmlns="http://www.w3.org/1998/Math/MathML" display="inline"'); // 13/08/2024 fix "\n" problem or anything :D
                    else appendChild += (t[i]) + '<br>';
                    continue;
                }
                else {
                    if (appendChild.length >= 1) {
                        if (t[i].includes('</span>')) t[i] = t[i].replace('</span>', '</span> ');
                        format.Question = appendChild + t[i];
                        appendChild = '';
                    }
                    else {
                        format.Question = t[i];
                    }
                    const backup = format.Question;
                    const parsed_math = splitTextAndMath(format.Question);
                    if (!parsed_math.math.length == 0) {
                        format.Question = ''
                        var tempText = ''
                        parsed_math.math.forEach(async (value, index) => {
                            const renderToMath = renderToMathML(value.content);
                            format.Question = '';
                            if (tempText == '') {
                                tempText = getText(parsed_math.text, value.id, renderToMath).replace('math display="block" class="tml-display" style="display:block math;"', 'math style="display:inline math;"')
                            }
                            else {
                                tempText = getText(tempText, value.id, renderToMath).replace('math display="block" class="tml-display" style="display:block math;"', 'math style="display:inline math;"')
                            }
                            format.Question = tempText;
                        })
                    }
                    if (format.Question.includes('temml-error')) format.Question = replaceMathSymbols(backup)
                    ii++; 
                }
            }
            else {

                if (t[i].includes('<') ) {
                    processMultipleLines(t[i]);
                    //check Ending
                    if (ConvertToSlotNumber(t[i]) != undefined && ConvertToSlotNumber(t[i]) != tempMathCheck.Index) {
                        tempMathCheck.Injection.Status = true;
                        tempMathCheck.Injection.Index = ConvertToSlotNumber(t[i]);
                        tempMathCheck.Injection.Section = tempMathCheck.currentSection
                    }
                    else if (tempMathCheck.Index == 0 && t[i].includes('A.')) {
                        if (t[i].endsWith(".") || t[i].endsWith(".</b>") || t[i].endsWith('.\t') || t[i].endsWith('</math></span>') || t[i].endsWith("</span>")) {
                            //type: 1 line
                            if (t[i].startsWith("*") || t[i].endsWith("*")) {
                                t[i] = t[i].replace('*', '');
                                format.Correct = ConvertToSlotNumber(t[i]);
                            }
                            format.Answer.push(t[i]);
                            tempMathCheck = {
                                Injection: {
                                    Index: 0,
                                    Status: false,
                                    Section: 'A'
                                },
                                Answer: 0,
                                Index: -1, // 1,2,3,4
                                currentSection: "A",
                                A: [],
                                B: [],
                                C: [],
                                D: []
                            };

                            ii++;
                        }
                    }

                    if (tempMathCheck.Injection.Status == true) {
                        if (t[i].endsWith(".") || t[i].endsWith(".</b>") || t[i].endsWith('.\t') || t[i].endsWith('</math></span>') || t[i].endsWith("</span>")) {
                            console.log(format, tempMathCheck.Injection.Index)
                            format.Answer[Number(tempMathCheck.Injection.Index)] = tempMathCheck[tempMathCheck.Injection.Section].join("").replace('*', '');
                            if (tempMathCheck.Answer == tempMathCheck.Injection.Index) format.Correct = tempMathCheck.Injection.Index;

                            if (Number(tempMathCheck.Injection.Index) == 3) {
                                obj.push(format); 
                                format = {
                                    Question: "",
                                    Answer: [],
                                    Correct: 0
                                }
                                ii = 1;
                                tempMathCheck = {
                                    Injection: {
                                        Index: 0,
                                        Status: false,
                                        Section: 'A'
                                    },
                                    Answer: 0,
                                    Index: -1, // 1,2,3,4
                                    currentSection: "A",
                                    A: [],
                                    B: [],
                                    C: [],
                                    D: []
                                };
                                continue;
                            }
                            else ii++;

                            tempMathCheck = {
                                Injection: {
                                    Index: 0,
                                    Status: false,
                                    Section: 'A'
                                },
                                Answer: 0,
                                Index: -1, // 1,2,3,4
                                currentSection: "A",
                                A: [],
                                B: [],
                                C: [],
                                D: []
                            };
                        
                        }
                    }
                    if (t[i].endsWith(".") || t[i].endsWith(".</b>") || t[i].endsWith('.\t') || t[i].endsWith('</math></span>') || t[i].endsWith("</span>")) {
                        if (ConvertToSlotNumber(tempMathCheck[tempMathCheck.currentSection].join(' ')) != undefined) {
                            format.Answer.push(tempMathCheck[tempMathCheck.currentSection].join(' ').replace('*',''));
                            if (tempMathCheck[tempMathCheck.currentSection].join(' ').startsWith('*')) {
                                format.Correct = ConvertToSlotNumber(tempMathCheck[tempMathCheck.currentSection].join(' '))
                            }
                            ii++;
                        }
                        tempMathCheck.Index++;
                    }
                    if (tempMathCheck.Index == 4) {

                        format.Answer = [tempMathCheck.A.join(' '),tempMathCheck.B.join(' '),tempMathCheck.C.join(' '),tempMathCheck.D.join(' ')]
                        format.Correct = tempMathCheck.Answer
                        format.Answer[tempMathCheck.Answer] = format.Answer[tempMathCheck.Answer].replace('*','')
                        obj.push(format); 
                        format = {
                                Question: "",
                                Answer: [],
                                Correct: 0
                            }
                        ii = 1;

                        tempMathCheck = {
                            Injection: {
                                Index: 0,
                                Status: false,
                                Section: 'A'
                            },
                            Answer: 0,
                            Index: 0, // 1,2,3,4
                            currentSection: "A",
                            A: [],
                            B: [],
                            C: [],
                            D: []
                        };
                        // default dt
                        continue;
                    }
                    else continue;
                }

                if (t[i].includes('\t')) {
                    let Format_Data = t[i].split('\t');

                        Format_Data.sort((a, b) => {
                                a = a.replace('*', '');
                                b = b.replace('*', '');
                            const aPrefix = a.startsWith('A.') ? 'A' : a.startsWith('B.') ? 'B' : a.startsWith('C.') ? 'C' : a.startsWith('D.') ? 'D' : 'Z';
                            const bPrefix = b.startsWith('A.') ? 'A' : b.startsWith('B.') ? 'B' : b.startsWith('C.') ? 'C' : b.startsWith('D.') ? 'D' : 'Z';
                            
                            if (aPrefix < bPrefix) return -1;
                            if (aPrefix > bPrefix) return 1;
                            return a.localeCompare(b);
                        });
                    
                    /**
                     * type 1: 
                     * a b
                     * c d
                     * 
                     * type 2
                     * a b c d
                     * 
                     * type how ?:
                     * 
                     * a
                     * b
                     * c
                     * d
                     * how :D
                     * 
                     * type bruh:
                     * 
                     * a b c
                     * d 
                     * ?????? bruhh
                     */
                    
                    if (!Format_Data[1].replace('*','').startsWith('B') && Format_Data[0].replace('*','').startsWith('A') || !Format_Data[1].replace('*','').startsWith('C') && Format_Data[0].replace('*','').startsWith('B') || Format_Data[0].replace('*','').startsWith('C') && !Format_Data[1].replace('*','').startsWith('D') || Format_Data[0].replace('*','').startsWith('D')) {
                        //how :D
                        if (Format_Data[0].startsWith('*') || Format_Data[0].endsWith('*')) {
                            Format_Data[0] = Format_Data[0].replace('*', '');
                            format.Correct = ConvertToSlotNumber(Format_Data[0])
                        }
                        format.Answer.push(Format_Data[0]);
                        ii++;
                    }

                    if (Format_Data[0] == '') continue; // hmm maybe "" ?

                    //type 2
                    if (Format_Data[2] != undefined && Format_Data[1].replace('*','').startsWith('B') && Format_Data[2].replace('*','').startsWith('C')) {
                        // avoid type bruh:>
                        if (!Format_Data[3].replace('*','').startsWith('D')) {
                            //type bruh :L
                            for (let j = 0; j < 3; j++) {
                                if (Format_Data[j].startsWith("*") || Format_Data[j].endsWith("*")) {
                                    Format_Data[j] = Format_Data[j].replace('*', '');
                                    format.Correct = ConvertToSlotNumber(Format_Data[j]);
                                }
                                format.Answer.push(Format_Data[j]);
                                ii++;
                            }
                        }
                        else {
                            // type 2 a b c d 1 row
                            for (let j = 0; j <= 3; j++) {
                                if (Format_Data[j].startsWith("*") || Format_Data[j].endsWith("*")) {
                                    Format_Data[j] = Format_Data[j].replace('*', '');
                                    format.Correct = ConvertToSlotNumber(Format_Data[j]);
                                }
                                format.Answer.push(Format_Data[j]);
                                ii++;
                            }
                        }
                    }
                    //type 1
                    if (Format_Data[0].replace('*','').startsWith('A') && Format_Data[1].replace('*','').startsWith('B') && (Format_Data[2] == undefined || !Format_Data[2].replace('*','').startsWith('C'))  || Format_Data[0].replace('*','').startsWith('C') && Format_Data[1].replace('*','').startsWith('D')) {
                        for (let j = 0; j < 2; j++) {
                            if (Format_Data[j].startsWith("*") || Format_Data[j].endsWith("*")) {
                                Format_Data[j] = Format_Data[j].replace('*', '');
                                format.Correct = ConvertToSlotNumber(Format_Data[j]);
                            }
                            format.Answer.push(Format_Data[j]);
                            ii++;
                        }
                    }
                }
                else {
                    //type a \n b \n c \n d
                    if (ConvertToSlotNumber(t[i]) == undefined) continue
                    if (t[i].startsWith("*") || t[i].endsWith("*")) {
                        t[i] = t[i].replace('*', '');
                        format.Correct = ConvertToSlotNumber(t[i]);
                    }
                    format.Answer.push(t[i].replace('math xmlns="http://www.w3.org/1998/Math/MathML" display="block"', 'math xmlns="http://www.w3.org/1998/Math/MathML" display="inline"'));
                    ii++;
                }
                if (ii == 6 || t[i].includes('D. ')) {
                    obj.push(format); 
                    format.Answer.forEach((data, LId) => {
                        const parsed_math = splitTextAndMath(data);
                        if (!parsed_math.math.length == 0) {
                            format.Answer[LId] = ''
                            parsed_math.math.forEach((value, index) => {
                                const renderToMath = renderToMathML(value.content);
                                format.Answer[LId] += getText(parsed_math.text, value.id, renderToMath).replace('math display="block" class="tml-display" style="display:block math;"', 'math style="display:inline math;"')
                            })
                            if (format.Answer[LId].includes('temml-error')) format.Answer[LId] = replaceMathSymbols(data)
                        }
                    })
                    format = {
                        Question: "",
                        Answer: [],
                        Correct: 0
                    }
                    tempMathCheck = {
                        Injection: {
                            Index: 0,
                            Status: false,
                            Section: 'A'
                        },
                        Answer: 0,
                        Index: 0, // 1,2,3,4
                        currentSection: "A",
                        A: [],
                        B: [],
                        C: [],
                        D: []
                    };
                    ii = 1;
                }
            }
        }
        
        function processMultipleLines(item) {
            // :D this can be destroy anything asf
            if (item.startsWith('A.') || item.startsWith('*A.')) {
                if (item.startsWith('*A.')) tempMathCheck.Answer = 0;
                tempMathCheck.currentSection = 'A';
            } else if (item.startsWith('B.') || item.startsWith('*B.')) {
                if (item.startsWith('*B.')) tempMathCheck.Answer = 1;
                tempMathCheck.currentSection = 'B';
            } else if (item.startsWith('C.') || item.startsWith('*C.')) {
                if (item.startsWith('*C.')) tempMathCheck.Answer = 2;
                tempMathCheck.currentSection = 'C';
            } else if (item.startsWith('D.') || item.startsWith('*D.')) {
                if (item.startsWith('*D.')) tempMathCheck.Answer = 3;
                tempMathCheck.currentSection = 'D';
            }
            tempMathCheck[tempMathCheck.currentSection].push(item.replace('math xmlns="http://www.w3.org/1998/Math/MathML" display="block"', 'math xmlns="http://www.w3.org/1998/Math/MathML" display="inline"'));
        }

        function ConvertToSlotNumber(type) {
            if (type.includes("A.")) {
                return 0
            }
            else if (type.includes("B.")) {
                return 1
            }
            else if (type.includes("C.")) {
                return 2
            }
            else if (type.includes("D.")) {
                return 3
            }
        }

        function replaceMathSymbols(text) {
            //CREDIT CHATGPT FR
            // Danh sách các ký hiệu toán học và ký tự thay thế của chúng
            const symbolMap = {
                '\\omega': 'ω',
                '\\alpha': 'α',
                '\\beta': 'β',
                '\\gamma': 'γ',
                '\\delta': 'δ',
                '\\epsilon': 'ε',
                '\\zeta': 'ζ',
                '\\eta': 'η',
                '\\theta': 'θ',
                '\\iota': 'ι',
                '\\kappa': 'κ',
                '\\lambda': 'λ',
                '\\mu': 'μ',
                '\\nu': 'ν',
                '\\xi': 'ξ',
                '\\omicron': 'ο',
                '\\pi': 'π',
                '\\rho': 'ρ',
                '\\sigma': 'σ',
                '\\tau': 'τ',
                '\\upsilon': 'υ',
                '\\phi': 'φ',
                '\\chi': 'χ',
                '\\psi': 'ψ',
                '\\omega': 'ω',
                '\\infty': '∞',
                '\\partial': '∂',
                '\\leq': '≤',
                '\\geq': '≥',
                '\\ne': '≠',
                '\\approx': '≈',
                '\\pm': '±',
                '\\times': '×',
                '\\div': '÷',
                '\\sum': '∑',
                '\\prod': '∏',
                '\\int': '∫',
                '\\sqrt': '√',
                '\\nabla': '∇',
                '\\forall': '∀',
                '\\exists': '∃',
                '\\subset': '⊂',
                '\\supset': '⊃',
                '\\cap': '∩',
                '\\cup': '∪'
            };
        
            // Thay thế các ký hiệu toán học trong chuỗi
            let result = text;
            for (const [key, value] of Object.entries(symbolMap)) {
                const regex = new RegExp(key, 'g');
                result = result.replace(regex, value);
            }
        
            return result;
        }        

        function renderToMathML(value) {
            if (value.trim() === '') {
                return;
            }
            let mml = temml.renderToString(value, {
                displayMode: true,
                annotate: false,
                xml: false
            });
            const format = require('xml-formatter');
            mml = format(mml, { indentation: '  ', collapseContent: true, lineSeparator: '\n' });
            return mml
        }

        function splitTextAndMath(input) {
            //CREDIT CHATGPT FR
            // Regex để phát hiện các thẻ HTML
            const htmlRegex = /<\/?[a-z][\s\S]*>/i;
        
            // Bước 1: Kiểm tra nếu văn bản chứa HTML
            if (htmlRegex.test(input)) {
                return {
                    math: [],
                    text: input.trim()
                };
            }
        
            // Regex để phát hiện các đoạn toán học
            const mathRegex =  /\\[a-zA-Z]+\{[^{}]*\}|\\[a-zA-Z]+\[.*?\]|\\[a-zA-Z]+|[^\\\s\w\u00C0-\u024F\u1E00-\u1EFF:.\s\-\?\,\+\[ăâđêôơưáàảãạắằẳẵặấầẩẫậéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữự]]+/g;
        
            let mathParts = [];
            let textParts = [];
            let currentMath = '';
            let currentText = '';
            let mathCounter = 0;
        
            // Bước 1: Chia văn bản thành các từ
            let words = input.split(" ");
            for (let i = 0; i < words.length; i++) {
                let word = words[i];
        
                // Bước 2: Kiểm tra nếu phần tử là toán học
                if (mathRegex.test(word)) {
                    // Nếu có đoạn toán học trước đó, lưu nó vào mathParts và reset currentText
                    if (currentText) {
                        textParts.push({
                            type: 'text',
                            content: currentText + ` %${++mathCounter}`
                        });
                        currentText = '';
                    }
        
                    // Thêm đoạn toán học vào currentMath
                    currentMath += (currentMath ? ' ' : '') + word;
                } 
                else if (isMathHeavy(word)) {
                    // Nếu có đoạn toán học trước đó, lưu nó vào mathParts và reset currentText
                    if (currentText) {
                        textParts.push({
                            type: 'text',
                            content: currentText + ` %${++mathCounter}`
                        });
                        currentText = '';
                    }
        
                    // Thêm đoạn toán học vào currentMath
                    currentMath += (currentMath ? ' ' : '') + word;
                }
                else {
                    // Nếu có đoạn toán học trước đó, lưu nó vào mathParts và reset currentMath
                    if (currentMath) {
                        mathParts.push({
                            id: mathCounter,
                            content: currentMath
                        });
                        currentMath = '';
                    }
        
                    // Thêm đoạn văn bản vào currentText
                    currentText += (currentText ? ' ' : '') + word;
                }
            }
        
            // Thêm phần toán học cuối cùng (nếu có) vào mathParts
            if (currentMath) {
                mathParts.push({
                    id: mathCounter,
                    content: currentMath
                });
            }
        
            // Thêm phần văn bản cuối cùng (nếu có) vào textParts
            if (currentText) {
                textParts.push({
                    type: 'text',
                    content: currentText
                });
            }
        
            // Kết hợp các phần text thành một chuỗi
            let combinedText = textParts.map(part => part.content).join('');
        
            return {
                math: mathParts,
                text: combinedText
            };
        }
        
        function getText(Text, Index, Value) {
            return Text.replace(RegExp(`%${Index}`, 'g'), Value);
        }

        function isMathHeavy(text) {
            //CREDIT CHATGPT FR

            // Regex để phát hiện các đoạn toán học
            const mathRegex = /\\[a-zA-Z]+\{[^{}]*\}|\\[a-zA-Z]+\[.*?\]|\\[a-zA-Z]+|[^\\\s\w\u00C0-\u024F\u1E00-\u1EFF:.\s\-\?]+/g;
        
            // Tìm tất cả các phần khớp với regex
            let matches = text.match(mathRegex);
        
            // Nếu không có phần nào khớp, trả về false
            if (!matches) {
                return false;
            }
        
            // Kết hợp tất cả các phần khớp thành một chuỗi
            let mathContent = matches.join('');
            
            // Tính tổng số ký tự trong văn bản
            let totalLength = text.length;
            
            // Tính tổng số ký tự thuộc về toán học
            let mathLength = mathContent.length;
        
            // Tính tỷ lệ ký tự thuộc về toán học
            let mathRatio = mathLength / totalLength;
        
            // Trả về true nếu tỷ lệ lớn hơn hoặc bằng 80%
            return mathRatio >= 0.80;
        }

        console.log(obj)
    return obj
}

function Css() {
    return `
        .content-container {
            height: 100%;
            width: 100%;
            backdrop-filter: blur(15px);
            position: absolute;
            display: none;
        }

        .content-container.active {
            display: block;
        }

        .timer {
            height: 30px;
            font-size: 24px;
            width: 80%;
            color: black;
            text-algin: center;
        }
        .htcuu {
            box-shadow: 0px 0px 25px blue;
            border-radius: 20px;
            border-color: blue;
            background-color: greenyellow;
        }
        .inputbox,
        .p2 {
            font-size: 20px;
            border-radius: 20px;
            margin: 0 auto;
            margin-top: 20px;
        }
        
        .inputbox,
        .p2,
        .timer {
            box-shadow: 0px 0px 20px black;
            border-radius: 20px;
        }
        
        .inputbox {
            resize: vertical;
            text-align: left;
            border-radius: 20px;
            border-color: transparent;
            height: 200px;
            width: 100%;
            color: black;
        }
        
        .popup-container {
            position: fixed;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background-color: #4caf50;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: move;
            z-index: 9999;
            right: 0;
            bottom: 0;
            background-image: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
        }
        
        .popup-content {
            position: fixed;
            background-color: white;
            padding: 20px;
            border: 1px solid #ccc;
            z-index: 10000;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            background-color: white;
            color: black;
            font-size: 40px;
            border-radius: 30px;
            max-height: 100vh;
            overflow: auto;
            width: 80%;
        }
    `
}

Create_Interface``
