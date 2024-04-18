(async function() {

const x = `	Đồ thị li độ - thời gian của vật là
*A. đường hình sin.	
B. đường thẳng.	
C. đường parabol.	
D. đường cong.
	Dao động được mô tả bằng biểu thức có dạng x=Acos(\omega t+\varphi) được gọi là dao động gì?
A. Dao động tắt dần.		B. Dao động cưỡng bức.
C. Dao động tự do.		*D. Dao động điều hòa.
	Tần số f của dao động điều hòa có đơn vị là
*A. Hz.	B. s.	C. rad/s.	D. rad.
	Chu kì T của dao động điều hòa có đơn vị là
*A. s.	B. Hz.	C. rad/s.	D. rad.
	Tần số góc ω của dao động điều hòa có đơn vị là
A. Hz.	B. s.	*C. rad/s.	D. rad.
`

var t = x.split('\n');
const obj = [];
var format = {
    Question: "",
    Answer: [],
    Correct: 0
}
var ii = 1
var appendChild = '';
for (let i = 0; i < t.length; i++) {
    if (ii === 1) { 
        if (t[i + 1] && !t[i + 1].includes("A")) {
            appendChild += (t[i]) + '\n';
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
              //  console.log(Format_Data[0])
                ii++;
            }

            // const mathRegex = /\\(?:cos|sin|omega|varphi|lambda|frac|left|right)\((.*?)\)/g;;
           // console.log("v=\\omega Acos\\left(\\omega t+\\varphi\\right).".match(mathRegex))
          //console.log(Format_Data)
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
            if (t[i].startsWith("*") || t[i].endsWith("*")) {
                t[i] = t[i].replace('*', '');
                format.Correct = ConvertToSlotNumber(t[i]);
            }
            format.Answer.push(t[i]);
           // console.log(format.Answer)
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

console.log(obj)

})();
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