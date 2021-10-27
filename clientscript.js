
var curpos=0;
var txtLength=0;
var el;

// {
//   alert("Changed!");}
//   );


function setCursor(message){
  var input = document.getElementById("code");
  if(message.rsi< curpos)
  {
    curpos= curpos+1;
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
  console.log(result.start +" of "+inputContent);
  curpos=result.start;
}

function detectChange() {
  // document.getElementById("code").addEventListener("input", (event) => 
  // alert("Changed!");
  let insertType = 0;
  var input = document.getElementById("code");
  var inputContent = input.value.length;
  // You may want to focus the textbox in case it's not
  // input.focus();
  var result = getInputSelection(input);
  console.log(result.start +" of "+inputContent);
  curpos=result.start;
  if(txtLength > inputContent)
  {
    // console.log("back");
    console.log("key " + inputContent);
    insertType = 1;
  }
  txtLength = inputContent;
  // console.log(input.value);
  var codeString = input.value.substring(0, result.start);
  detectDeletionKey();
  sendData(codeString,curpos, insertType);
  keyDel=0;
  // var resultSpan = document.getElementById("result");
  
  // if(result.start == result.end){
  //   resultSpan.innerHTML = "No text selected. Position of cursor is " + result.start +" of " +inputContent;
  // }else{
  //   resultSpan.innerHTML = "You've selected text ("+result.start+" to "+ result.end +") from a total length of " + inputContent;
  // }
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

function detectDeletionKey(){
    var input = document.getElementById('code');
    input.onkeydown = function() {
        var key = event.keyCode || event.charCode;
        if( key == 8 || key == 46){
            //backspace pressed
            // alert('Empty');
            keyDel=1;
            return 1;
        }
           
    };
     return 0;
}