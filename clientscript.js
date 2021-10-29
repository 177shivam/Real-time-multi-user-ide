
var curpos=0;
var txtLength=0;
var el;
var selectBegin=-1;
var selectEnd=-1;
var lengthBeforeSelection;

// insertType{insert=0,back=1,multinsert=2,multidel=3}

function setCursor(message){
  var input = document.getElementById("code");
  // console.log("curpos "+curpos);
  if(message.rsi< curpos)
  {
    curpos= curpos+message.rsidiff;
  }
  else
  {
    input.selectionEnd=curpos;
  }
  txtLength = message.data.length;
  console.log(curpos);
  input.setSelectionRange(curpos,curpos);

}

function getpo()
{
  var input = document.getElementById("code");
  var inputContent = input.value.length;
  // You may want to focus the textbox in case it's not
  // input.focus();
  var result = getInputSelection(input);
  // console.log(result.start +" of "+inputContent);
  curpos=result.start;
}

function selectionRange(){
  var input = document.getElementById("code");
  var inputContent = input.value.length;
  var result = getInputSelection(input);
  // console.log(result.start +" select of "+inputContent);
  curpos=result.start;
  if(txtLength > inputContent)
  {
    console.log("key " + inputContent);
    insertType = 1;
  }
  txtLength = inputContent;
  // console.log(input.value);
  var codeString = input.value.substring(0, result.start);
  // sendData(codeString,curpos, insertType);
  keyDel=0;
  
  if(result.start == result.end){
    // console.log("No selected. cursor is " + result.start +" of " +inputContent);
    selectBegin=-2;     //only ctrl v
     selectEnd=-2;
     lengthBeforeSelection = inputContent;
  }else{
     console.log("selected ("+result.start+" to "+ result.end +") from a total of " + inputContent);
     selectBegin=result.start;  // ctrl  v with selection
     selectEnd=result.end;
     lengthBeforeSelection = inputContent;
  }
  // console.log("out " +input.value.substring(result.start,result.end));    //char selected
  
}

function detectChange() {
  // document.getElementById("code").addEventListener("input", (event) => 
  // alert("Changed!");
  let insertType = 0;
  var input = document.getElementById("code");
  var inputContent = input.value.length;
  var lengthAfterSelection;
  var cursorBeforePaste = -1;
  // You may want to focus the textbox in case it's not
  // input.focus();
  var result = getInputSelection(input);
  // console.log(result.start +" of "+inputContent);
  curpos=result.start;
  if(txtLength > inputContent)
  {
    // console.log("back");
    // console.log("key " + inputContent);
    insertType = 1;
  }
  if(selectBegin >= 0 || selectBegin == -2)
  {
    insertType = 2;
    lengthAfterSelection = selectEnd - selectBegin+ inputContent-  lengthBeforeSelection;
    // console.log("paste legth " + lengthAfterSelection);
    // console.log("sel "+ selectBegin + "  "+selectEnd);
    cursorBeforePaste = result.start - lengthAfterSelection;
  }
  txtLength = inputContent;
  // console.log(input.value);
  var codeString = input.value.substring(0, result.start);
  // detectDeletionKey();
  
  if(result.start == result.end){
    console.log("No text selected. Position of cursor is " + result.start +" of " +inputContent);
    // selectBegin=-1;
    //  selectEnd=-1;
  }else{
    // resultSpan.innerHTML =
     console.log("You've selected text ("+result.start+" to "+ result.end +") from a total length of " + inputContent);
  }

  sendData(codeString,curpos, insertType,selectEnd,cursorBeforePaste);
  selectBegin=-1;
  selectEnd=-1;
}

function getInputSelection(el) {
    var start = 0, end = 0, normalizedValue, range,
        textInputRange, len, endRange;

    if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
        start = el.selectionStart;
        end = el.selectionEnd;
    } else {
        range = document.selection.createRange();

        if (range && range.parentElement() == el) {
            len = el.value.length;
            normalizedValue = el.value.replace(/\r\n/g, "\n");

            // Create a working TextRange that lives only in the input
            textInputRange = el.createTextRange();
            textInputRange.moveToBookmark(range.getBookmark());

            // Check if the start and end of the selection are at the very end
            // of the input, since moveStart/moveEnd doesn't return what we want
            // in those cases
            endRange = el.createTextRange();
            endRange.collapse(false);

            if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                start = end = len;
            } else {
                start = -textInputRange.moveStart("character", -len);
                start += normalizedValue.slice(0, start).split("\n").length - 1;

                if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                    end = len;
                } else {
                    end = -textInputRange.moveEnd("character", -len);
                    end += normalizedValue.slice(0, end).split("\n").length - 1;
                }
            }
        }
    }

    return {
        start: start,
        end: end
    };
}

// document.getElementById("trigger").addEventListener("click", function(){
//   var input = document.getElementById("texto");
//   var inputContent = input.value.length;
//   // You may want to focus the textbox in case it's not
//   input.focus();
//   var result = getInputSelection(input);
//   var resultSpan = document.getElementById("result");
  
//   if(result.start == result.end){
//     resultSpan.innerHTML = "No text selected. Position of cursor is " + result.start +" of " +inputContent;
//   }else{
//     resultSpan.innerHTML = "You've selected text ("+result.start+" to "+ result.end +") from a total length of " + inputContent;
//   }
  
// }, false);

// function detectDeletionKey(){
//     var input = document.getElementById('code');
//     input.onkeydown = function() {
//         var key = event.keyCode || event.charCode;
//         if( key == 8 || key == 46){
//             //backspace pressed
//             // alert('Empty');
//             keyDel=1;
//             return 1;
//         }
           
//     };
//      return 0;
// }

// function getTextAreaSelection(textarea) {
//     var start = textarea.selectionStart, end = textarea.selectionEnd;
//     return {
//         start: start,
//         end: end,
//         length: end - start,
//         text: textarea.value.slice(start, end)
//     };
// }

// function detectPaste(textarea, callback) {
//     textarea.paste = function() {
//         var sel = getTextAreaSelection(textarea);
//         var initialLength = textarea.value.length;
//         window.setTimeout(function() {
//             var val = textarea.value;
//             var pastedTextLength = val.length - (initialLength - sel.length);
//             var end = sel.start + pastedTextLength;
//             callback({
//                 start: sel.start,
//                 end: end,
//                 length: pastedTextLength,
//                 text: val.slice(sel.start, end)
//             });
//         }, 1);
//     };
// }

// var textarea = document.getElementById("code");
// detectPaste(textarea, function(pasteInfo) {
//     alert(pasteInfo.text);
//     // pasteInfo also has properties for the start and end character
//     // index and length of the pasted text
// });