let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;
let lastUpdateTime = performance.now();
let popupContainerClicked = false;

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

    let count = document.createElement('p');
        count.innerHTML = "Đã Thêm: 0";
        count.id = 'Count';
        count.className = 'p2';
        count.style.width = '200px';
        count.style.fontSize = '24px';

    popupContent.appendChild(count);

    let Status = document.createElement('p');
        Status.id = 'Status';
        Status.innerHTML = "Trạng Thái: Chưa Xong";
        Status.className = 'p2';
        Status.style.color = 'red';
        Status.style.fontSize = '24px';
        Status.style.width = '50%'
    popupContent.appendChild(Status);

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

    let btn = document.createElement('button');
        btn.id = "SubmitCuaKanzu";
        btn.className='htcuu';
        btn.innerHTML = "Tự Động Thêm";
    popupContent.appendChild(btn);

    new MovementAndDisplay(popupContainer,popupContent,contentContainer)
    document.body.appendChild(popupContainer);
    contentContainer.appendChild(popupContent);
    document.body.appendChild(contentContainer);
    
    document.getElementById('SubmitCuaKanzu').addEventListener('click', async function(e) {
        e.preventDefault();
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
                    if (t[i].includes("<")) appendChild += (t[i]); // 13/08/2024 fix "\n" problem or anything :D
                    else appendChild += (t[i]) + '<br>';
                    continue;
                }
                else {
                    if (appendChild.length >= 1) {
                        format.Question = appendChild + t[i];
                        appendChild = '';
                    }
                    else {
                        format.Question = t[i];
                    }
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
                        if (t[i].endsWith(".") || t[i].endsWith(".</b>") || t[i].endsWith('.\t') || t[i].endsWith('</math></span>')) {
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
                        if (t[i].endsWith(".") || t[i].endsWith(".</b>") || t[i].endsWith('.\t') || t[i].endsWith('</math></span>')) {
                            console.log(format, tempMathCheck.Injection.Index)
                            format.Answer[Number(tempMathCheck.Injection.Index)] = tempMathCheck[tempMathCheck.Injection.Section].join(" ");
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
                    if (t[i].endsWith(".") || t[i].endsWith(".</b>") || t[i].endsWith('.\t') || t[i].endsWith('</math></span>')) tempMathCheck.Index++;
                    if (tempMathCheck.Index == 4) {

                        format.Answer = [tempMathCheck.A.join(' '),tempMathCheck.B.join(' '),tempMathCheck.C.join(' '),tempMathCheck.D.join(' ')]
                        format.Correct = tempMathCheck.Answer
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
                    if (Format_Data[1].replace('*','').startsWith('B') && Format_Data[2].replace('*','').startsWith('C')) {
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
                    if (Format_Data[0].replace('*','').startsWith('A') && Format_Data[1].replace('*','').startsWith('B') && !Format_Data[2].replace('*','').startsWith('C') || Format_Data[0].replace('*','').startsWith('C') && Format_Data[1].replace('*','').startsWith('D')) {
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
                    format.Answer.push(t[i]);
                    ii++;
                }
                if (ii == 6) { 
                    obj.push(format); format = {
                        Question: "",
                        Answer: [],
                        Correct: 0
                    }
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
            tempMathCheck[tempMathCheck.currentSection].push(item);
        }

        console.log(obj)
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
        }
    `
}

Create_Interface``

