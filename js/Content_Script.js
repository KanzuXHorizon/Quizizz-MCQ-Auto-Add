function createPopup() {
    // Create the popup container
    const popupContainer = document.createElement('div');
    popupContainer.classList.add('popup-container');
    popupContainer.textContent = 'Auto';
    popupContainer.id = 'popup-container';

    // Create the popup content
    const popupContent = document.createElement('div');
    popupContent.classList.add('popup-content');
    popupContent.id = 'popup-content';

    const popupContentInner = document.createElement('div');
    var h1 = document.createElement('h1');
        h1.textContent = "Tuỳ Chỉnh Tự Động"
        popupContentInner.appendChild(h1);
    var count = document.createElement('p');
        count.innerHTML = "Đã Thêm: 0";
        count.id = 'Count';
        count.className = 'p2';
        popupContentInner.appendChild(count);
    var Status = document.createElement('p');
        Status.id = 'Status';
        Status.innerHTML = "Trạng Thái: Chưa Xong";
        Status.className = 'p2';
        popupContentInner.appendChild(Status);
    var min = document.createElement('input');
        min.placeholder = "Hãy nhập thời gian vô đây (số 1 = 1 phút, 2 = 2 phút)";
        min.className = 'timer';
        min.id = "timer"
        popupContentInner.appendChild(min);
    var p = document.createElement('p');
        p.innerHTML = `Hãy nhập câu hỏi và câu trả lời vào hộp ở dưới, lưu ý là câu hỏi phải có câu trả lời và được đánh dấu = dấu *, ví dụ "A. 132, *B. 133,... trong đó B là câu đúng do có dấu * trước câu.Những câu bị thiếu đáp án sẽ được thông báo sau khi xong, mặc định đáp án của mấy câu thiếu là A.`
        p.className = "p2";
        popupContentInner.appendChild(p);
    var textare = document.createElement('textarea');
        textare.id = "DataCuaKanzu";
        textare.spellcheck = false;
        textare.className = "inputbox";
        popupContentInner.appendChild(textare);
    var btn = document.createElement('button');
        btn.id = "SubmitCuaKanzu";
        btn.className='htcuu';
        btn.innerHTML = "Tự Động Thêm";
        popupContentInner.appendChild(btn);

    
    //     popupContentInner.innerHTML = `
    //   <h1>Tuỳ Chỉnh Tự Động</h1>
    //   <p class='p2'>Hãy nhập câu hỏi và câu trả lời vào hộp  ở dưới, lưu ý là câu hỏi phải có câu trả lời và được đánh dấu = dấu *, ví dụ "A. 132, *B. 133,... trong đó B là câu đúng do có dấu * trước câu.</p> 
    //   <textarea id="DataCuaKanzu"spellcheck="false" class='inputbox' type='textbox' placeholder=''> </textarea> 
    //   <button class="htcuu" id="SubmitCuaKanzu";> Tự Động Thêm </button>
    // `;

    popupContent.appendChild(popupContentInner);
    
    

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
    .timer {
        height: 20px;
        font-size: 14px;
        width: 50%;
        color: black;
    }
    .htcuu {
      box-shadow: 0px 0px 20px black;
      border-radius: 20px;
      border-color: blue;
      background-color: blue;
    }
    .inputbox, .p2 {
      font-size: 15px;
      border-radius: 20px;
      margin: 0 auto;
      margin-top: 20px;
    }

    .inputbox,.p2,.timer {
      box-shadow: 0px 0px 20px black;
      border-radius: 20px;
    }

    .inputbox {
      resize: vertical;
      text-align: left;
      border-radius: 20px;
      border-color: transparent;
      height: 200px;
      width: 800px;
      color: black;
    }

      .popup-container {
        position: fixed;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #4CAF50;
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
        display: none;
        position: fixed;
        background-color: white;
        padding: 20px;
        border: 1px solid #ccc;
        z-index: 10000;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        background-image: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
        color: white;
        font-size: 40px
      }
    `;
    document.head.appendChild(style);

    // Add event listeners to the popup container
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;


    popupContainer.addEventListener('mousedown', dragStart);
    popupContainer.addEventListener('mouseup', dragEnd);
    popupContainer.addEventListener('mousemove', drag);

    popupContainer.addEventListener('click', () => {
      if (popupContent.style.display == 'block') {
        popupContent.style.display = 'none';
      }
      else popupContent.style.display = 'block';
    });

    // document.addEventListener('click', (event) => {
    //   if (event.target !== popupContainer && event.target !== popupContent) {
    //     popupContent.style.display = 'none';
    //   }
    // });

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

    function drag(e) {
      if (isDragging) {
        e.preventDefault();

        if (e.target === popupContainer) {
          currentX = e.clientX - initialX;
          currentY = e.clientY - initialY;

          xOffset = currentX;
          yOffset = currentY;

          setTranslate(currentX, currentY, popupContainer);
        }
      }
    }

    function setTranslate(xPos, yPos, el) {
      el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }

    // Append the popup to the document body
    document.body.appendChild(popupContainer);
    document.body.appendChild(popupContent);
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
        var  ii = 1
        //console.log(t)
        for (let i = 0; i < t.length; i++) {
            if (ii === 1) { 
                //đề
                
                if (t[i + 1] && !t[i + 1].includes("A")) {
                    t.splice(0,1);
                }
                else {
                    format.Question = t[i];
                    ii++; 
                }
            }
            else {
                if (t[i].includes('\t') && (t[i]).split('\t')[(t[i]).split('\t').length - 1] != '') {
                    let formatt = t[i].split('\t');
                    //normal 2
                    let aw1 = formatt[0];
                    let aw2 = formatt[formatt.length - 1];
                    if (aw2.includes("B") || aw2.includes("D")) {
                        if (aw1.startsWith('*') || aw1.endsWith('*')) {
                            aw1 = aw1.replace('*', '')
                            format.Correct = sw(aw1);
                        }
                        if (aw2.startsWith('*') || aw2.endsWith('*')) {
                            aw2 = aw2.replace('*', '')
                            format.Correct = sw(aw2);
                        }
                        format.Answer.push(aw1);
                        format.Answer.push(aw2)
                        ii+=2;
                    }
                    else {
                        if (aw1.startsWith('*') || aw1.endsWith('*')) {
                            aw1.replace('*', '')
                            format.Correct = sw(aw1);
                        }
                        format.Answer.push(aw1);
                        ii++;
                    }
                    
                }
                else {
                    if (t[i].startsWith('*') || t[i].endsWith('*')) {
                        t[i] = (t[i]).replace('*', "")
                        format.Correct = sw(t[i])
                    }
                    format.Answer.push(t[i])
                    ii++;
                }
                if (ii == 6) { 
                    obj.push(format); format = {
                    Question: "",
                    Answer: [] }
                    ii = 1;
                }
            }
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
            //await new Promise((re,rj) => setTimeout(re, 300));
            document.getElementById('Count').innerHTML = 'Đã Thêm: ' +  x
        }
        document.getElementById('Status').innerHTML = "Trạng Thái: Đã Xong | Nhấn F5 để xem đầy đủ câu hỏi đã thêm";
        alert("Đã Hoàn Thành!");
        if (error_aw.length != 0) {
            alert('NHỮNG CÂU SAU BỊ THIẾU ĐÁP ÁN:\n' + error_aw.join('\n'));
        }
        alert('Nhấn f5 để reload lại trang và thấy câu hỏi đã thêm!!')
    })
    document.body.appendChild(style);
    
  }

  createPopup();

  function generate661dString() {
    // Generate a random 16-character string
    let result = '661d72a1942ccb7afc0ef';
    const characters = '456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 25; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  

  function sw(type) {
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