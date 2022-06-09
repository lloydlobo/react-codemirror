"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var state=require("@codemirror/state"),view=require("@codemirror/view"),language=require("@codemirror/language"),common=require("@lezer/common");const toggleComment=e=>{let t=getConfig(e.state);return t.line?toggleLineComment(e):!!t.block&&toggleBlockCommentByLine(e)};function command(e,t){return({state:r,dispatch:n})=>{if(r.readOnly)return!1;let o=e(t,r);return!!o&&(n(r.update(o)),!0)}}const toggleLineComment=command(changeLineComment,0),lineComment=command(changeLineComment,1),lineUncomment=command(changeLineComment,2),toggleBlockComment=command(changeBlockComment,0),blockComment=command(changeBlockComment,1),blockUncomment=command(changeBlockComment,2),toggleBlockCommentByLine=command(((e,t)=>changeBlockComment(e,t,selectedLineRanges(t))),0);function getConfig(e,t=e.selection.main.head){let r=e.languageDataAt("commentTokens",t);return r.length?r[0]:{}}const SearchMargin=50;function findBlockComment(e,{open:t,close:r},n,o){let s,a,l=e.sliceDoc(n-50,n),c=e.sliceDoc(o,o+50),i=/\s*$/.exec(l)[0].length,d=/^\s*/.exec(c)[0].length,u=l.length-i;if(l.slice(u-t.length,u)==t&&c.slice(d,d+r.length)==r)return{open:{pos:n-i,margin:i&&1},close:{pos:o+d,margin:d&&1}};o-n<=100?s=a=e.sliceDoc(n,o):(s=e.sliceDoc(n,n+50),a=e.sliceDoc(o-50,o));let h=/^\s*/.exec(s)[0].length,p=/\s*$/.exec(a)[0].length,m=a.length-p-r.length;return s.slice(h,h+t.length)==t&&a.slice(m,m+r.length)==r?{open:{pos:n+h+t.length,margin:/\s/.test(s.charAt(h+t.length))?1:0},close:{pos:o-p-r.length,margin:/\s/.test(a.charAt(m-1))?1:0}}:null}function selectedLineRanges(e){let t=[];for(let r of e.selection.ranges){let n=e.doc.lineAt(r.from),o=r.to<=n.to?n:e.doc.lineAt(r.to),s=t.length-1;s>=0&&t[s].to>n.from?t[s].to=o.to:t.push({from:n.from,to:o.to})}return t}function changeBlockComment(e,t,r=t.selection.ranges){let n=r.map((e=>getConfig(t,e.from).block));if(!n.every((e=>e)))return null;let o=r.map(((e,r)=>findBlockComment(t,n[r],e.from,e.to)));if(2!=e&&!o.every((e=>e)))return{changes:t.changes(r.map(((e,t)=>o[t]?[]:[{from:e.from,insert:n[t].open+" "},{from:e.to,insert:" "+n[t].close}])))};if(1!=e&&o.some((e=>e))){let e=[];for(let t,r=0;r<o.length;r++)if(t=o[r]){let o=n[r],{open:s,close:a}=t;e.push({from:s.pos-o.open.length,to:s.pos+s.margin},{from:a.pos-a.margin,to:a.pos+o.close.length})}return{changes:e}}return null}function changeLineComment(e,t,r=t.selection.ranges){let n=[],o=-1;for(let{from:s,to:a}of r){let e=n.length,r=1e9;for(let l=s;l<=a;){let e=t.doc.lineAt(l);if(e.from>o&&(s==a||a>e.from)){o=e.from;let s=getConfig(t,l).line;if(!s)continue;let a=/^\s*/.exec(e.text)[0].length,c=a==e.length,i=e.text.slice(a,a+s.length)==s?a:-1;a<e.text.length&&a<r&&(r=a),n.push({line:e,comment:i,token:s,indent:a,empty:c,single:!1})}l=e.to+1}if(r<1e9)for(let t=e;t<n.length;t++)n[t].indent<n[t].line.text.length&&(n[t].indent=r);n.length==e+1&&(n[e].single=!0)}if(2!=e&&n.some((e=>e.comment<0&&(!e.empty||e.single)))){let e=[];for(let{line:t,token:o,indent:s,empty:a,single:l}of n)!l&&a||e.push({from:t.from+s,insert:o+" "});let r=t.changes(e);return{changes:r,selection:t.selection.map(r,1)}}if(1!=e&&n.some((e=>e.comment>=0))){let e=[];for(let{line:t,comment:r,token:o}of n)if(r>=0){let n=t.from+r,s=n+o.length;" "==t.text[s-t.from]&&s++,e.push({from:n,to:s})}return{changes:e}}return null}const fromHistory=state.Annotation.define(),isolateHistory=state.Annotation.define(),invertedEffects=state.Facet.define(),historyConfig=state.Facet.define({combine:e=>state.combineConfig(e,{minDepth:100,newGroupDelay:500},{minDepth:Math.max,newGroupDelay:Math.min})});function changeEnd(e){let t=0;return e.iterChangedRanges(((e,r)=>t=r)),t}const historyField_=state.StateField.define({create:()=>HistoryState.empty,update(e,t){let r=t.state.facet(historyConfig),n=t.annotation(fromHistory);if(n){let o=t.docChanged?state.EditorSelection.single(changeEnd(t.changes)):void 0,s=HistEvent.fromTransaction(t,o),a=n.side,l=0==a?e.undone:e.done;return l=s?updateBranch(l,l.length,r.minDepth,s):addSelection(l,t.startState.selection),new HistoryState(0==a?n.rest:l,0==a?l:n.rest)}let o=t.annotation(isolateHistory);if("full"!=o&&"before"!=o||(e=e.isolate()),!1===t.annotation(state.Transaction.addToHistory))return t.changes.empty?e:e.addMapping(t.changes.desc);let s=HistEvent.fromTransaction(t),a=t.annotation(state.Transaction.time),l=t.annotation(state.Transaction.userEvent);return s?e=e.addChanges(s,a,l,r.newGroupDelay,r.minDepth):t.selection&&(e=e.addSelection(t.startState.selection,a,l,r.newGroupDelay)),"full"!=o&&"after"!=o||(e=e.isolate()),e},toJSON:e=>({done:e.done.map((e=>e.toJSON())),undone:e.undone.map((e=>e.toJSON()))}),fromJSON:e=>new HistoryState(e.done.map(HistEvent.fromJSON),e.undone.map(HistEvent.fromJSON))});function history(e={}){return[historyField_,historyConfig.of(e),view.EditorView.domEventHandlers({beforeinput(e,t){let r="historyUndo"==e.inputType?undo:"historyRedo"==e.inputType?redo:null;return!!r&&(e.preventDefault(),r(t))}})]}const historyField=historyField_;function cmd(e,t){return function({state:r,dispatch:n}){if(!t&&r.readOnly)return!1;let o=r.field(historyField_,!1);if(!o)return!1;let s=o.pop(e,r,t);return!!s&&(n(s),!0)}}const undo=cmd(0,!1),redo=cmd(1,!1),undoSelection=cmd(0,!0),redoSelection=cmd(1,!0);function depth(e){return function(t){let r=t.field(historyField_,!1);if(!r)return 0;let n=0==e?r.done:r.undone;return n.length-(n.length&&!n[0].changes?1:0)}}const undoDepth=depth(0),redoDepth=depth(1);class HistEvent{constructor(e,t,r,n,o){this.changes=e,this.effects=t,this.mapped=r,this.startSelection=n,this.selectionsAfter=o}setSelAfter(e){return new HistEvent(this.changes,this.effects,this.mapped,this.startSelection,e)}toJSON(){var e,t,r;return{changes:null===(e=this.changes)||void 0===e?void 0:e.toJSON(),mapped:null===(t=this.mapped)||void 0===t?void 0:t.toJSON(),startSelection:null===(r=this.startSelection)||void 0===r?void 0:r.toJSON(),selectionsAfter:this.selectionsAfter.map((e=>e.toJSON()))}}static fromJSON(e){return new HistEvent(e.changes&&state.ChangeSet.fromJSON(e.changes),[],e.mapped&&state.ChangeDesc.fromJSON(e.mapped),e.startSelection&&state.EditorSelection.fromJSON(e.startSelection),e.selectionsAfter.map(state.EditorSelection.fromJSON))}static fromTransaction(e,t){let r=none;for(let n of e.startState.facet(invertedEffects)){let t=n(e);t.length&&(r=r.concat(t))}return!r.length&&e.changes.empty?null:new HistEvent(e.changes.invert(e.startState.doc),r,void 0,t||e.startState.selection,none)}static selection(e){return new HistEvent(void 0,none,void 0,void 0,e)}}function updateBranch(e,t,r,n){let o=t+1>r+20?t-r-1:0,s=e.slice(o,t);return s.push(n),s}function isAdjacent(e,t){let r=[],n=!1;return e.iterChangedRanges(((e,t)=>r.push(e,t))),t.iterChangedRanges(((e,t,o,s)=>{for(let a=0;a<r.length;){let e=r[a++],t=r[a++];s>=e&&o<=t&&(n=!0)}})),n}function eqSelectionShape(e,t){return e.ranges.length==t.ranges.length&&0===e.ranges.filter(((e,r)=>e.empty!=t.ranges[r].empty)).length}function conc(e,t){return e.length?t.length?e.concat(t):e:t}const none=[],MaxSelectionsPerEvent=200;function addSelection(e,t){if(e.length){let r=e[e.length-1],n=r.selectionsAfter.slice(Math.max(0,r.selectionsAfter.length-200));return n.length&&n[n.length-1].eq(t)?e:(n.push(t),updateBranch(e,e.length-1,1e9,r.setSelAfter(n)))}return[HistEvent.selection([t])]}function popSelection(e){let t=e[e.length-1],r=e.slice();return r[e.length-1]=t.setSelAfter(t.selectionsAfter.slice(0,t.selectionsAfter.length-1)),r}function addMappingToBranch(e,t){if(!e.length)return e;let r=e.length,n=none;for(;r;){let o=mapEvent(e[r-1],t,n);if(o.changes&&!o.changes.empty||o.effects.length){let t=e.slice(0,r);return t[r-1]=o,t}t=o.mapped,r--,n=o.selectionsAfter}return n.length?[HistEvent.selection(n)]:none}function mapEvent(e,t,r){let n=conc(e.selectionsAfter.length?e.selectionsAfter.map((e=>e.map(t))):none,r);if(!e.changes)return HistEvent.selection(n);let o=e.changes.map(t),s=t.mapDesc(e.changes,!0),a=e.mapped?e.mapped.composeDesc(s):s;return new HistEvent(o,state.StateEffect.mapEffects(e.effects,t),a,e.startSelection.map(s),n)}const joinableUserEvent=/^(input\.type|delete)($|\.)/;class HistoryState{constructor(e,t,r=0,n){this.done=e,this.undone=t,this.prevTime=r,this.prevUserEvent=n}isolate(){return this.prevTime?new HistoryState(this.done,this.undone):this}addChanges(e,t,r,n,o){let s=this.done,a=s[s.length-1];return s=a&&a.changes&&!a.changes.empty&&e.changes&&(!r||joinableUserEvent.test(r))&&(!a.selectionsAfter.length&&t-this.prevTime<n&&isAdjacent(a.changes,e.changes)||"input.type.compose"==r)?updateBranch(s,s.length-1,o,new HistEvent(e.changes.compose(a.changes),conc(e.effects,a.effects),a.mapped,a.startSelection,none)):updateBranch(s,s.length,o,e),new HistoryState(s,none,t,r)}addSelection(e,t,r,n){let o=this.done.length?this.done[this.done.length-1].selectionsAfter:none;return o.length>0&&t-this.prevTime<n&&r==this.prevUserEvent&&r&&/^select($|\.)/.test(r)&&eqSelectionShape(o[o.length-1],e)?this:new HistoryState(addSelection(this.done,e),this.undone,t,r)}addMapping(e){return new HistoryState(addMappingToBranch(this.done,e),addMappingToBranch(this.undone,e),this.prevTime,this.prevUserEvent)}pop(e,t,r){let n=0==e?this.done:this.undone;if(0==n.length)return null;let o=n[n.length-1];if(r&&o.selectionsAfter.length)return t.update({selection:o.selectionsAfter[o.selectionsAfter.length-1],annotations:fromHistory.of({side:e,rest:popSelection(n)}),userEvent:0==e?"select.undo":"select.redo",scrollIntoView:!0});if(o.changes){let r=1==n.length?none:n.slice(0,n.length-1);return o.mapped&&(r=addMappingToBranch(r,o.mapped)),t.update({changes:o.changes,selection:o.startSelection,effects:o.effects,annotations:fromHistory.of({side:e,rest:r}),filter:!1,userEvent:0==e?"undo":"redo",scrollIntoView:!0})}return null}}HistoryState.empty=new HistoryState(none,none);const historyKeymap=[{key:"Mod-z",run:undo,preventDefault:!0},{key:"Mod-y",mac:"Mod-Shift-z",run:redo,preventDefault:!0},{key:"Mod-u",run:undoSelection,preventDefault:!0},{key:"Alt-u",mac:"Mod-Shift-u",run:redoSelection,preventDefault:!0}];function updateSel(e,t){return state.EditorSelection.create(e.ranges.map(t),e.mainIndex)}function setSel(e,t){return e.update({selection:t,scrollIntoView:!0,userEvent:"select"})}function moveSel({state:e,dispatch:t},r){let n=updateSel(e.selection,r);return!n.eq(e.selection)&&(t(setSel(e,n)),!0)}function rangeEnd(e,t){return state.EditorSelection.cursor(t?e.to:e.from)}function cursorByChar(e,t){return moveSel(e,(r=>r.empty?e.moveByChar(r,t):rangeEnd(r,t)))}function ltrAtCursor(e){return e.textDirectionAt(e.state.selection.main.head)==view.Direction.LTR}const cursorCharLeft=e=>cursorByChar(e,!ltrAtCursor(e)),cursorCharRight=e=>cursorByChar(e,ltrAtCursor(e)),cursorCharForward=e=>cursorByChar(e,!0),cursorCharBackward=e=>cursorByChar(e,!1);function cursorByGroup(e,t){return moveSel(e,(r=>r.empty?e.moveByGroup(r,t):rangeEnd(r,t)))}const cursorGroupLeft=e=>cursorByGroup(e,!ltrAtCursor(e)),cursorGroupRight=e=>cursorByGroup(e,ltrAtCursor(e)),cursorGroupForward=e=>cursorByGroup(e,!0),cursorGroupBackward=e=>cursorByGroup(e,!1);function moveBySubword(e,t,r){let n=e.state.charCategorizer(t.from);return e.moveByChar(t,r,(o=>{let s=state.CharCategory.Space,a=t.from,l=!1,c=!1,i=!1,d=t=>{if(l)return!1;a+=r?t.length:-t.length;let o,d=n(t);if(s==state.CharCategory.Space&&(s=d),s!=d)return!1;if(s==state.CharCategory.Word)if(t.toLowerCase()==t){if(!r&&c)return!1;i=!0}else if(i){if(r)return!1;l=!0}else{if(c&&r&&n(o=e.state.sliceDoc(a,a+1))==state.CharCategory.Word&&o.toLowerCase()==o)return!1;c=!0}return!0};return d(o),d}))}function cursorBySubword(e,t){return moveSel(e,(r=>r.empty?moveBySubword(e,r,t):rangeEnd(r,t)))}const cursorSubwordForward=e=>cursorBySubword(e,!0),cursorSubwordBackward=e=>cursorBySubword(e,!1);function interestingNode(e,t,r){if(t.type.prop(r))return!0;let n=t.to-t.from;return n&&(n>2||/[^\s,.;:]/.test(e.sliceDoc(t.from,t.to)))||t.firstChild}function moveBySyntax(e,t,r){let n,o,s=language.syntaxTree(e).resolveInner(t.head),a=r?common.NodeProp.closedBy:common.NodeProp.openedBy;for(let l=t.head;;){let t=r?s.childAfter(l):s.childBefore(l);if(!t)break;interestingNode(e,t,a)?s=t:l=r?t.to:t.from}return o=s.type.prop(a)&&(n=r?language.matchBrackets(e,s.from,1):language.matchBrackets(e,s.to,-1))&&n.matched?r?n.end.to:n.end.from:r?s.to:s.from,state.EditorSelection.cursor(o,r?-1:1)}const cursorSyntaxLeft=e=>moveSel(e,(t=>moveBySyntax(e.state,t,!ltrAtCursor(e)))),cursorSyntaxRight=e=>moveSel(e,(t=>moveBySyntax(e.state,t,ltrAtCursor(e))));function cursorByLine(e,t){return moveSel(e,(r=>{if(!r.empty)return rangeEnd(r,t);let n=e.moveVertically(r,t);return n.head!=r.head?n:e.moveToLineBoundary(r,t)}))}const cursorLineUp=e=>cursorByLine(e,!1),cursorLineDown=e=>cursorByLine(e,!0);function pageHeight(e){return Math.max(e.defaultLineHeight,Math.min(e.dom.clientHeight,innerHeight)-5)}function cursorByPage(e,t){let{state:r}=e,n=updateSel(r.selection,(r=>r.empty?e.moveVertically(r,t,pageHeight(e)):rangeEnd(r,t)));if(n.eq(r.selection))return!1;let o,s=e.coordsAtPos(r.selection.main.head),a=e.scrollDOM.getBoundingClientRect();return s&&s.top>a.top&&s.bottom<a.bottom&&s.top-a.top<=e.scrollDOM.scrollHeight-e.scrollDOM.scrollTop-e.scrollDOM.clientHeight&&(o=view.EditorView.scrollIntoView(n.main.head,{y:"start",yMargin:s.top-a.top})),e.dispatch(setSel(r,n),{effects:o}),!0}const cursorPageUp=e=>cursorByPage(e,!1),cursorPageDown=e=>cursorByPage(e,!0);function moveByLineBoundary(e,t,r){let n=e.lineBlockAt(t.head),o=e.moveToLineBoundary(t,r);if(o.head==t.head&&o.head!=(r?n.to:n.from)&&(o=e.moveToLineBoundary(t,r,!1)),!r&&o.head==n.from&&n.length){let r=/^\s*/.exec(e.state.sliceDoc(n.from,Math.min(n.from+100,n.to)))[0].length;r&&t.head!=n.from+r&&(o=state.EditorSelection.cursor(n.from+r))}return o}const cursorLineBoundaryForward=e=>moveSel(e,(t=>moveByLineBoundary(e,t,!0))),cursorLineBoundaryBackward=e=>moveSel(e,(t=>moveByLineBoundary(e,t,!1))),cursorLineStart=e=>moveSel(e,(t=>state.EditorSelection.cursor(e.lineBlockAt(t.head).from,1))),cursorLineEnd=e=>moveSel(e,(t=>state.EditorSelection.cursor(e.lineBlockAt(t.head).to,-1)));function toMatchingBracket(e,t,r){let n=!1,o=updateSel(e.selection,(t=>{let o=language.matchBrackets(e,t.head,-1)||language.matchBrackets(e,t.head,1)||t.head>0&&language.matchBrackets(e,t.head-1,1)||t.head<e.doc.length&&language.matchBrackets(e,t.head+1,-1);if(!o||!o.end)return t;n=!0;let s=o.start.from==t.head?o.end.to:o.end.from;return r?state.EditorSelection.range(t.anchor,s):state.EditorSelection.cursor(s)}));return!!n&&(t(setSel(e,o)),!0)}const cursorMatchingBracket=({state:e,dispatch:t})=>toMatchingBracket(e,t,!1),selectMatchingBracket=({state:e,dispatch:t})=>toMatchingBracket(e,t,!0);function extendSel(e,t){let r=updateSel(e.state.selection,(e=>{let r=t(e);return state.EditorSelection.range(e.anchor,r.head,r.goalColumn)}));return!r.eq(e.state.selection)&&(e.dispatch(setSel(e.state,r)),!0)}function selectByChar(e,t){return extendSel(e,(r=>e.moveByChar(r,t)))}const selectCharLeft=e=>selectByChar(e,!ltrAtCursor(e)),selectCharRight=e=>selectByChar(e,ltrAtCursor(e)),selectCharForward=e=>selectByChar(e,!0),selectCharBackward=e=>selectByChar(e,!1);function selectByGroup(e,t){return extendSel(e,(r=>e.moveByGroup(r,t)))}const selectGroupLeft=e=>selectByGroup(e,!ltrAtCursor(e)),selectGroupRight=e=>selectByGroup(e,ltrAtCursor(e)),selectGroupForward=e=>selectByGroup(e,!0),selectGroupBackward=e=>selectByGroup(e,!1);function selectBySubword(e,t){return extendSel(e,(r=>moveBySubword(e,r,t)))}const selectSubwordForward=e=>selectBySubword(e,!0),selectSubwordBackward=e=>selectBySubword(e,!1),selectSyntaxLeft=e=>extendSel(e,(t=>moveBySyntax(e.state,t,!ltrAtCursor(e)))),selectSyntaxRight=e=>extendSel(e,(t=>moveBySyntax(e.state,t,ltrAtCursor(e))));function selectByLine(e,t){return extendSel(e,(r=>e.moveVertically(r,t)))}const selectLineUp=e=>selectByLine(e,!1),selectLineDown=e=>selectByLine(e,!0);function selectByPage(e,t){return extendSel(e,(r=>e.moveVertically(r,t,pageHeight(e))))}const selectPageUp=e=>selectByPage(e,!1),selectPageDown=e=>selectByPage(e,!0),selectLineBoundaryForward=e=>extendSel(e,(t=>moveByLineBoundary(e,t,!0))),selectLineBoundaryBackward=e=>extendSel(e,(t=>moveByLineBoundary(e,t,!1))),selectLineStart=e=>extendSel(e,(t=>state.EditorSelection.cursor(e.lineBlockAt(t.head).from))),selectLineEnd=e=>extendSel(e,(t=>state.EditorSelection.cursor(e.lineBlockAt(t.head).to))),cursorDocStart=({state:e,dispatch:t})=>(t(setSel(e,{anchor:0})),!0),cursorDocEnd=({state:e,dispatch:t})=>(t(setSel(e,{anchor:e.doc.length})),!0),selectDocStart=({state:e,dispatch:t})=>(t(setSel(e,{anchor:e.selection.main.anchor,head:0})),!0),selectDocEnd=({state:e,dispatch:t})=>(t(setSel(e,{anchor:e.selection.main.anchor,head:e.doc.length})),!0),selectAll=({state:e,dispatch:t})=>(t(e.update({selection:{anchor:0,head:e.doc.length},userEvent:"select"})),!0),selectLine=({state:e,dispatch:t})=>{let r=selectedLineBlocks(e).map((({from:t,to:r})=>state.EditorSelection.range(t,Math.min(r+1,e.doc.length))));return t(e.update({selection:state.EditorSelection.create(r),userEvent:"select"})),!0},selectParentSyntax=({state:e,dispatch:t})=>{let r=updateSel(e.selection,(t=>{var r;let n=language.syntaxTree(e).resolveInner(t.head,1);for(;!(n.from<t.from&&n.to>=t.to||n.to>t.to&&n.from<=t.from)&&(null===(r=n.parent)||void 0===r?void 0:r.parent);)n=n.parent;return state.EditorSelection.range(n.to,n.from)}));return t(setSel(e,r)),!0},simplifySelection=({state:e,dispatch:t})=>{let r=e.selection,n=null;return r.ranges.length>1?n=state.EditorSelection.create([r.main]):r.main.empty||(n=state.EditorSelection.create([state.EditorSelection.cursor(r.main.head)])),!!n&&(t(setSel(e,n)),!0)};function deleteBy({state:e,dispatch:t},r){if(e.readOnly)return!1;let n="delete.selection",o=e.changeByRange((e=>{let{from:t,to:o}=e;if(t==o){let e=r(t);e<t?n="delete.backward":e>t&&(n="delete.forward"),t=Math.min(t,e),o=Math.max(o,e)}return t==o?{range:e}:{changes:{from:t,to:o},range:state.EditorSelection.cursor(t)}}));return!o.changes.empty&&(t(e.update(o,{scrollIntoView:!0,userEvent:n})),!0)}function skipAtomic(e,t,r){if(e instanceof view.EditorView)for(let n of e.state.facet(view.EditorView.atomicRanges).map((t=>t(e))))n.between(t,t,((e,n)=>{e<t&&n>t&&(t=r?n:e)}));return t}const deleteByChar=(e,t)=>deleteBy(e,(r=>{let n,o,{state:s}=e,a=s.doc.lineAt(r);if(!t&&r>a.from&&r<a.from+200&&!/[^ \t]/.test(n=a.text.slice(0,r-a.from))){if("\t"==n[n.length-1])return r-1;let e=state.countColumn(n,s.tabSize)%language.getIndentUnit(s)||language.getIndentUnit(s);for(let t=0;t<e&&" "==n[n.length-1-t];t++)r--;o=r}else o=state.findClusterBreak(a.text,r-a.from,t,t)+a.from,o==r&&a.number!=(t?s.doc.lines:1)&&(o+=t?1:-1);return skipAtomic(e,o,t)})),deleteCharBackward=e=>deleteByChar(e,!1),deleteCharForward=e=>deleteByChar(e,!0),deleteByGroup=(e,t)=>deleteBy(e,(r=>{let n=r,{state:o}=e,s=o.doc.lineAt(n),a=o.charCategorizer(n);for(let e=null;;){if(n==(t?s.to:s.from)){n==r&&s.number!=(t?o.doc.lines:1)&&(n+=t?1:-1);break}let l=state.findClusterBreak(s.text,n-s.from,t)+s.from,c=s.text.slice(Math.min(n,l)-s.from,Math.max(n,l)-s.from),i=a(c);if(null!=e&&i!=e)break;" "==c&&n==r||(e=i),n=l}return skipAtomic(e,n,t)})),deleteGroupBackward=e=>deleteByGroup(e,!1),deleteGroupForward=e=>deleteByGroup(e,!0),deleteToLineEnd=e=>deleteBy(e,(t=>{let r=e.lineBlockAt(t).to;return skipAtomic(e,t<r?r:Math.min(e.state.doc.length,t+1),!0)})),deleteToLineStart=e=>deleteBy(e,(t=>{let r=e.lineBlockAt(t).from;return skipAtomic(e,t>r?r:Math.max(0,t-1),!1)})),deleteTrailingWhitespace=({state:e,dispatch:t})=>{if(e.readOnly)return!1;let r=[];for(let n=0,o="",s=e.doc.iter();;){if(s.next(),s.lineBreak||s.done){let e=o.search(/\s+$/);if(e>-1&&r.push({from:n-(o.length-e),to:n}),s.done)break;o=""}else o=s.value;n+=s.value.length}return!!r.length&&(t(e.update({changes:r,userEvent:"delete"})),!0)},splitLine=({state:e,dispatch:t})=>{if(e.readOnly)return!1;let r=e.changeByRange((e=>({changes:{from:e.from,to:e.to,insert:state.Text.of(["",""])},range:state.EditorSelection.cursor(e.from)})));return t(e.update(r,{scrollIntoView:!0,userEvent:"input"})),!0},transposeChars=({state:e,dispatch:t})=>{if(e.readOnly)return!1;let r=e.changeByRange((t=>{if(!t.empty||0==t.from||t.from==e.doc.length)return{range:t};let r=t.from,n=e.doc.lineAt(r),o=r==n.from?r-1:state.findClusterBreak(n.text,r-n.from,!1)+n.from,s=r==n.to?r+1:state.findClusterBreak(n.text,r-n.from,!0)+n.from;return{changes:{from:o,to:s,insert:e.doc.slice(r,s).append(e.doc.slice(o,r))},range:state.EditorSelection.cursor(s)}}));return!r.changes.empty&&(t(e.update(r,{scrollIntoView:!0,userEvent:"move.character"})),!0)};function selectedLineBlocks(e){let t=[],r=-1;for(let n of e.selection.ranges){let o=e.doc.lineAt(n.from),s=e.doc.lineAt(n.to);if(n.empty||n.to!=s.from||(s=e.doc.lineAt(n.to-1)),r>=o.number){let e=t[t.length-1];e.to=s.to,e.ranges.push(n)}else t.push({from:o.from,to:s.to,ranges:[n]});r=s.number+1}return t}function moveLine(e,t,r){if(e.readOnly)return!1;let n=[],o=[];for(let s of selectedLineBlocks(e)){if(r?s.to==e.doc.length:0==s.from)continue;let t=e.doc.lineAt(r?s.to+1:s.from-1),a=t.length+1;if(r){n.push({from:s.to,to:t.to},{from:s.from,insert:t.text+e.lineBreak});for(let t of s.ranges)o.push(state.EditorSelection.range(Math.min(e.doc.length,t.anchor+a),Math.min(e.doc.length,t.head+a)))}else{n.push({from:t.from,to:s.from},{from:s.to,insert:e.lineBreak+t.text});for(let e of s.ranges)o.push(state.EditorSelection.range(e.anchor-a,e.head-a))}}return!!n.length&&(t(e.update({changes:n,scrollIntoView:!0,selection:state.EditorSelection.create(o,e.selection.mainIndex),userEvent:"move.line"})),!0)}const moveLineUp=({state:e,dispatch:t})=>moveLine(e,t,!1),moveLineDown=({state:e,dispatch:t})=>moveLine(e,t,!0);function copyLine(e,t,r){if(e.readOnly)return!1;let n=[];for(let o of selectedLineBlocks(e))r?n.push({from:o.from,insert:e.doc.slice(o.from,o.to)+e.lineBreak}):n.push({from:o.to,insert:e.lineBreak+e.doc.slice(o.from,o.to)});return t(e.update({changes:n,scrollIntoView:!0,userEvent:"input.copyline"})),!0}const copyLineUp=({state:e,dispatch:t})=>copyLine(e,t,!1),copyLineDown=({state:e,dispatch:t})=>copyLine(e,t,!0),deleteLine=e=>{if(e.state.readOnly)return!1;let{state:t}=e,r=t.changes(selectedLineBlocks(t).map((({from:e,to:r})=>(e>0?e--:r<t.doc.length&&r++,{from:e,to:r})))),n=updateSel(t.selection,(t=>e.moveVertically(t,!0))).map(r);return e.dispatch({changes:r,selection:n,scrollIntoView:!0,userEvent:"delete.line"}),!0},insertNewline=({state:e,dispatch:t})=>(t(e.update(e.replaceSelection(e.lineBreak),{scrollIntoView:!0,userEvent:"input"})),!0);function isBetweenBrackets(e,t){if(/\(\)|\[\]|\{\}/.test(e.sliceDoc(t-1,t+1)))return{from:t,to:t};let r,n=language.syntaxTree(e).resolveInner(t),o=n.childBefore(t),s=n.childAfter(t);return o&&s&&o.to<=t&&s.from>=t&&(r=o.type.prop(common.NodeProp.closedBy))&&r.indexOf(s.name)>-1&&e.doc.lineAt(o.to).from==e.doc.lineAt(s.from).from?{from:o.to,to:s.from}:null}const insertNewlineAndIndent=newlineAndIndent(!1),insertBlankLine=newlineAndIndent(!0);function newlineAndIndent(e){return({state:t,dispatch:r})=>{if(t.readOnly)return!1;let n=t.changeByRange((r=>{let{from:n,to:o}=r,s=t.doc.lineAt(n),a=!e&&n==o&&isBetweenBrackets(t,n);e&&(n=o=(o<=s.to?s:t.doc.lineAt(o)).to);let l=new language.IndentContext(t,{simulateBreak:n,simulateDoubleBreak:!!a}),c=language.getIndentation(l,n);for(null==c&&(c=/^\s*/.exec(t.doc.lineAt(n).text)[0].length);o<s.to&&/\s/.test(s.text[o-s.from]);)o++;a?({from:n,to:o}=a):n>s.from&&n<s.from+100&&!/\S/.test(s.text.slice(0,n))&&(n=s.from);let i=["",language.indentString(t,c)];return a&&i.push(language.indentString(t,l.lineIndent(s.from,-1))),{changes:{from:n,to:o,insert:state.Text.of(i)},range:state.EditorSelection.cursor(n+1+i[1].length)}}));return r(t.update(n,{scrollIntoView:!0,userEvent:"input"})),!0}}function changeBySelectedLine(e,t){let r=-1;return e.changeByRange((n=>{let o=[];for(let a=n.from;a<=n.to;){let s=e.doc.lineAt(a);s.number>r&&(n.empty||n.to>s.from)&&(t(s,o,n),r=s.number),a=s.to+1}let s=e.changes(o);return{changes:o,range:state.EditorSelection.range(s.mapPos(n.anchor,1),s.mapPos(n.head,1))}}))}const indentSelection=({state:e,dispatch:t})=>{if(e.readOnly)return!1;let r=Object.create(null),n=new language.IndentContext(e,{overrideIndentation:e=>{let t=r[e];return null==t?-1:t}}),o=changeBySelectedLine(e,((t,o,s)=>{let a=language.getIndentation(n,t.from);if(null==a)return;/\S/.test(t.text)||(a=0);let l=/^\s*/.exec(t.text)[0],c=language.indentString(e,a);(l!=c||s.from<t.from+l.length)&&(r[t.from]=a,o.push({from:t.from,to:t.from+l.length,insert:c}))}));return o.changes.empty||t(e.update(o,{userEvent:"indent"})),!0},indentMore=({state:e,dispatch:t})=>!e.readOnly&&(t(e.update(changeBySelectedLine(e,((t,r)=>{r.push({from:t.from,insert:e.facet(language.indentUnit)})})),{userEvent:"input.indent"})),!0),indentLess=({state:e,dispatch:t})=>!e.readOnly&&(t(e.update(changeBySelectedLine(e,((t,r)=>{let n=/^\s*/.exec(t.text)[0];if(!n)return;let o=state.countColumn(n,e.tabSize),s=0,a=language.indentString(e,Math.max(0,o-language.getIndentUnit(e)));for(;s<n.length&&s<a.length&&n.charCodeAt(s)==a.charCodeAt(s);)s++;r.push({from:t.from+s,to:t.from+n.length,insert:a.slice(s)})})),{userEvent:"delete.dedent"})),!0),insertTab=({state:e,dispatch:t})=>e.selection.ranges.some((e=>!e.empty))?indentMore({state:e,dispatch:t}):(t(e.update(e.replaceSelection("\t"),{scrollIntoView:!0,userEvent:"input"})),!0),emacsStyleKeymap=[{key:"Ctrl-b",run:cursorCharLeft,shift:selectCharLeft,preventDefault:!0},{key:"Ctrl-f",run:cursorCharRight,shift:selectCharRight},{key:"Ctrl-p",run:cursorLineUp,shift:selectLineUp},{key:"Ctrl-n",run:cursorLineDown,shift:selectLineDown},{key:"Ctrl-a",run:cursorLineStart,shift:selectLineStart},{key:"Ctrl-e",run:cursorLineEnd,shift:selectLineEnd},{key:"Ctrl-d",run:deleteCharForward},{key:"Ctrl-h",run:deleteCharBackward},{key:"Ctrl-k",run:deleteToLineEnd},{key:"Ctrl-Alt-h",run:deleteGroupBackward},{key:"Ctrl-o",run:splitLine},{key:"Ctrl-t",run:transposeChars},{key:"Ctrl-v",run:cursorPageDown}],standardKeymap=[{key:"ArrowLeft",run:cursorCharLeft,shift:selectCharLeft,preventDefault:!0},{key:"Mod-ArrowLeft",mac:"Alt-ArrowLeft",run:cursorGroupLeft,shift:selectGroupLeft},{mac:"Cmd-ArrowLeft",run:cursorLineBoundaryBackward,shift:selectLineBoundaryBackward},{key:"ArrowRight",run:cursorCharRight,shift:selectCharRight,preventDefault:!0},{key:"Mod-ArrowRight",mac:"Alt-ArrowRight",run:cursorGroupRight,shift:selectGroupRight},{mac:"Cmd-ArrowRight",run:cursorLineBoundaryForward,shift:selectLineBoundaryForward},{key:"ArrowUp",run:cursorLineUp,shift:selectLineUp,preventDefault:!0},{mac:"Cmd-ArrowUp",run:cursorDocStart,shift:selectDocStart},{mac:"Ctrl-ArrowUp",run:cursorPageUp,shift:selectPageUp},{key:"ArrowDown",run:cursorLineDown,shift:selectLineDown,preventDefault:!0},{mac:"Cmd-ArrowDown",run:cursorDocEnd,shift:selectDocEnd},{mac:"Ctrl-ArrowDown",run:cursorPageDown,shift:selectPageDown},{key:"PageUp",run:cursorPageUp,shift:selectPageUp},{key:"PageDown",run:cursorPageDown,shift:selectPageDown},{key:"Home",run:cursorLineBoundaryBackward,shift:selectLineBoundaryBackward,preventDefault:!0},{key:"Mod-Home",run:cursorDocStart,shift:selectDocStart},{key:"End",run:cursorLineBoundaryForward,shift:selectLineBoundaryForward,preventDefault:!0},{key:"Mod-End",run:cursorDocEnd,shift:selectDocEnd},{key:"Enter",run:insertNewlineAndIndent},{key:"Mod-a",run:selectAll},{key:"Backspace",run:deleteCharBackward,shift:deleteCharBackward},{key:"Delete",run:deleteCharForward},{key:"Mod-Backspace",mac:"Alt-Backspace",run:deleteGroupBackward},{key:"Mod-Delete",mac:"Alt-Delete",run:deleteGroupForward},{mac:"Mod-Backspace",run:deleteToLineStart},{mac:"Mod-Delete",run:deleteToLineEnd}].concat(emacsStyleKeymap.map((e=>({mac:e.key,run:e.run,shift:e.shift})))),defaultKeymap=[{key:"Alt-ArrowLeft",mac:"Ctrl-ArrowLeft",run:cursorSyntaxLeft,shift:selectSyntaxLeft},{key:"Alt-ArrowRight",mac:"Ctrl-ArrowRight",run:cursorSyntaxRight,shift:selectSyntaxRight},{key:"Alt-ArrowUp",run:moveLineUp},{key:"Shift-Alt-ArrowUp",run:copyLineUp},{key:"Alt-ArrowDown",run:moveLineDown},{key:"Shift-Alt-ArrowDown",run:copyLineDown},{key:"Escape",run:simplifySelection},{key:"Mod-Enter",run:insertBlankLine},{key:"Alt-l",mac:"Ctrl-l",run:selectLine},{key:"Mod-i",run:selectParentSyntax,preventDefault:!0},{key:"Mod-[",run:indentLess},{key:"Mod-]",run:indentMore},{key:"Mod-Alt-\\",run:indentSelection},{key:"Shift-Mod-k",run:deleteLine},{key:"Shift-Mod-\\",run:cursorMatchingBracket},{key:"Mod-/",run:toggleComment},{key:"Alt-A",run:toggleBlockComment}].concat(standardKeymap),indentWithTab={key:"Tab",run:indentMore,shift:indentLess};exports.blockComment=blockComment,exports.blockUncomment=blockUncomment,exports.copyLineDown=copyLineDown,exports.copyLineUp=copyLineUp,exports.cursorCharBackward=cursorCharBackward,exports.cursorCharForward=cursorCharForward,exports.cursorCharLeft=cursorCharLeft,exports.cursorCharRight=cursorCharRight,exports.cursorDocEnd=cursorDocEnd,exports.cursorDocStart=cursorDocStart,exports.cursorGroupBackward=cursorGroupBackward,exports.cursorGroupForward=cursorGroupForward,exports.cursorGroupLeft=cursorGroupLeft,exports.cursorGroupRight=cursorGroupRight,exports.cursorLineBoundaryBackward=cursorLineBoundaryBackward,exports.cursorLineBoundaryForward=cursorLineBoundaryForward,exports.cursorLineDown=cursorLineDown,exports.cursorLineEnd=cursorLineEnd,exports.cursorLineStart=cursorLineStart,exports.cursorLineUp=cursorLineUp,exports.cursorMatchingBracket=cursorMatchingBracket,exports.cursorPageDown=cursorPageDown,exports.cursorPageUp=cursorPageUp,exports.cursorSubwordBackward=cursorSubwordBackward,exports.cursorSubwordForward=cursorSubwordForward,exports.cursorSyntaxLeft=cursorSyntaxLeft,exports.cursorSyntaxRight=cursorSyntaxRight,exports.defaultKeymap=defaultKeymap,exports.deleteCharBackward=deleteCharBackward,exports.deleteCharForward=deleteCharForward,exports.deleteGroupBackward=deleteGroupBackward,exports.deleteGroupForward=deleteGroupForward,exports.deleteLine=deleteLine,exports.deleteToLineEnd=deleteToLineEnd,exports.deleteToLineStart=deleteToLineStart,exports.deleteTrailingWhitespace=deleteTrailingWhitespace,exports.emacsStyleKeymap=emacsStyleKeymap,exports.history=history,exports.historyField=historyField,exports.historyKeymap=historyKeymap,exports.indentLess=indentLess,exports.indentMore=indentMore,exports.indentSelection=indentSelection,exports.indentWithTab=indentWithTab,exports.insertBlankLine=insertBlankLine,exports.insertNewline=insertNewline,exports.insertNewlineAndIndent=insertNewlineAndIndent,exports.insertTab=insertTab,exports.invertedEffects=invertedEffects,exports.isolateHistory=isolateHistory,exports.lineComment=lineComment,exports.lineUncomment=lineUncomment,exports.moveLineDown=moveLineDown,exports.moveLineUp=moveLineUp,exports.redo=redo,exports.redoDepth=redoDepth,exports.redoSelection=redoSelection,exports.selectAll=selectAll,exports.selectCharBackward=selectCharBackward,exports.selectCharForward=selectCharForward,exports.selectCharLeft=selectCharLeft,exports.selectCharRight=selectCharRight,exports.selectDocEnd=selectDocEnd,exports.selectDocStart=selectDocStart,exports.selectGroupBackward=selectGroupBackward,exports.selectGroupForward=selectGroupForward,exports.selectGroupLeft=selectGroupLeft,exports.selectGroupRight=selectGroupRight,exports.selectLine=selectLine,exports.selectLineBoundaryBackward=selectLineBoundaryBackward,exports.selectLineBoundaryForward=selectLineBoundaryForward,exports.selectLineDown=selectLineDown,exports.selectLineEnd=selectLineEnd,exports.selectLineStart=selectLineStart,exports.selectLineUp=selectLineUp,exports.selectMatchingBracket=selectMatchingBracket,exports.selectPageDown=selectPageDown,exports.selectPageUp=selectPageUp,exports.selectParentSyntax=selectParentSyntax,exports.selectSubwordBackward=selectSubwordBackward,exports.selectSubwordForward=selectSubwordForward,exports.selectSyntaxLeft=selectSyntaxLeft,exports.selectSyntaxRight=selectSyntaxRight,exports.simplifySelection=simplifySelection,exports.splitLine=splitLine,exports.standardKeymap=standardKeymap,exports.toggleBlockComment=toggleBlockComment,exports.toggleBlockCommentByLine=toggleBlockCommentByLine,exports.toggleComment=toggleComment,exports.toggleLineComment=toggleLineComment,exports.transposeChars=transposeChars,exports.undo=undo,exports.undoDepth=undoDepth,exports.undoSelection=undoSelection;