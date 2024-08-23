function Create_Module() {
    if (location.href.includes('https://azota.vn/vi/de-thi/') && !document.getElementById('kzzzne')) {
        const interval = setInterval(() => {
            const history_btn_container = document.querySelector("#azt-layout > div.azt-body.ng-star-inserted > div.flex.md\\:mt-0.mt-\\[4\\.7rem\\] > div > div.azt-content > azt-parent-checking-box > div > div > app-exam-history > div > div");
            if (history_btn_container) {
                history_btn_container.style.display = 'flex';
                clearInterval(interval); // Dừng kiểm tra khi đã tìm thấy element
                const hash = location.href.split('/')[5].split('?')[0]
                //create another btn
                const crawl_btn = document.createElement('button');
                    crawl_btn.className = "btn btn-outline-secondary p-3 block mx-auto";
                    crawl_btn.style.border = '2px solid white';
                    crawl_btn.innerHTML = 'Lấy dữ liệu câu hỏi';
                    crawl_btn.id = 'kzzzne'
                    crawl_btn.onclick = async function() {
                        const Data = await fetch(`https://api.azota.vn/api/FrontExamResultHistory/GetHistoryObjs?HashId=${hash}&nextPage=`, {
                            "headers": {
                              "accept": "application/json",
                              "accept-language": "en-US,en;q=0.9,vi;q=0.8",
                              "authorization": "Bearer " + localStorage.user_token,
                              "priority": "u=1, i",
                              "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Brave\";v=\"127\", \"Chromium\";v=\"127\"",
                              "sec-ch-ua-mobile": "?0",
                              "sec-ch-ua-platform": "\"Windows\"",
                              "sec-fetch-dest": "empty",
                              "sec-fetch-mode": "cors",
                              "sec-fetch-site": "same-site",
                              "sec-gpc": "1"
                            },
                            "referrer": "https://azota.vn/",
                            "referrerPolicy": "strict-origin-when-cross-origin",
                            "body": null,
                            "method": "GET"
                        });
                        const parse_data = await Data.json();
                        console.log(parse_data.data);
                        if (parse_data.data.objs.length > 0) {
                            const id = parse_data.data.objs[0].id;
                            const answer = await fetch(`https://api.azota.vn/api/FrontExamResult/GetExamAnswer?hashId=${hash}&resultId=${id}&shareOfflineHashId=`, {
                                "headers": {
                                  "accept": "application/json",
                                  "accept-language": "en-US,en;q=0.9,vi;q=0.8",
                                  "authorization": "Bearer " + localStorage.user_token,
                                  "priority": "u=1, i",
                                  "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Brave\";v=\"127\", \"Chromium\";v=\"127\"",
                                  "sec-ch-ua-mobile": "?0",
                                  "sec-ch-ua-platform": "\"Windows\"",
                                  "sec-fetch-dest": "empty",
                                  "sec-fetch-mode": "cors",
                                  "sec-fetch-site": "same-site",
                                  "sec-gpc": "1"
                                },
                                "referrer": "https://azota.vn/",
                                "referrerPolicy": "strict-origin-when-cross-origin",
                                "body": null,
                                "method": "GET",
                                "mode": "cors"
                            });
                            const parse_answer = await answer.json();
                            console.log(parse_answer.data.questionObjs)
                            let Question_N_Answer = '';

                            if (parse_answer.data.questionObjs) {
                                const Data_answ = parse_answer.data.questionObjs;
                                for (let i of Data_answ) {
                                    Question_N_Answer += formatQuestion(i) + '\n'
                                }
                                navigator.clipboard.writeText(Question_N_Answer).then(() => {
                                    alert('thành công !!! nó ở trong clipboard')
                                }).catch(e => {
                                    alert('Đã lỗi');
                                    console.log(e)
                                })
                            }

                        }
                        else {
                            alert('bạn chưa từng thi hoặc giáo viên không cho hiện đáp án !')
                        }

                        
                    }
                history_btn_container.appendChild(crawl_btn);
            
                //<button azt-track-service="exam-history-_84BMuODi" class="btn btn-outline-secondary p-3 block mx-auto"><!----> Xem lịch sử làm bài </button>
                //
            }
        }, 500); // kiểm tra mỗi 500ms
    }

    function formatQuestion(data) {
        const { content, answers, answerResult } = data;
        let formattedQuestion = `${content}\n`;
      
        answers.forEach((answer) => {
          const prefix = answerResult.includes(answer.key) ? '*' : '';
          formattedQuestion += `${prefix}${answer.alpha}. ${answer.content.endsWith('.') ? answer.content : answer.content + '.'}\n`;
        });
      
        return formattedQuestion;
    }
      
    
}
setInterval(() => Create_Module(), 1000);
