(self.webpackChunk_uiw_react_codemirror=self.webpackChunk_uiw_react_codemirror||[]).push([[9973],{77097:function(e,t,n){!function(e){"use strict";function t(e,t){if(!e.hasOwnProperty(t))throw new Error("Undefined state "+t+" in simple mode")}function n(e,t){if(!e)return/(?:)/;var n="";return e instanceof RegExp?(e.ignoreCase&&(n="i"),e.unicode&&(n+="u"),e=e.source):e=String(e),new RegExp((!1===t?"":"^")+"(?:"+e+")",n)}function i(e){if(!e)return null;if(e.apply)return e;if("string"==typeof e)return e.replace(/\./g," ");for(var t=[],n=0;n<e.length;n++)t.push(e[n]&&e[n].replace(/\./g," "));return t}function r(e,r){(e.next||e.push)&&t(r,e.next||e.push),this.regex=n(e.regex),this.token=i(e.token),this.data=e}function o(e,t){return function(n,i){if(i.pending){var r=i.pending.shift();return 0==i.pending.length&&(i.pending=null),n.pos+=r.text.length,r.token}if(i.local){if(i.local.end&&n.match(i.local.end)){var o=i.local.endToken||null;return i.local=i.localState=null,o}var a;return o=i.local.mode.token(n,i.localState),i.local.endScan&&(a=i.local.endScan.exec(n.current()))&&(n.pos=n.start+a.index),o}for(var s=e[i.state],d=0;d<s.length;d++){var c=s[d],S=(!c.data.sol||n.sol())&&n.match(c.regex);if(S){c.data.next?i.state=c.data.next:c.data.push?((i.stack||(i.stack=[])).push(i.state),i.state=c.data.push):c.data.pop&&i.stack&&i.stack.length&&(i.state=i.stack.pop()),c.data.mode&&l(t,i,c.data.mode,c.token),c.data.indent&&i.indent.push(n.indentation()+t.indentUnit),c.data.dedent&&i.indent.pop();var u=c.token;if(u&&u.apply&&(u=u(S)),S.length>2&&c.token&&"string"!=typeof c.token){for(var p=2;p<S.length;p++)S[p]&&(i.pending||(i.pending=[])).push({text:S[p],token:c.token[p-1]});return n.backUp(S[0].length-(S[1]?S[1].length:0)),u[0]}return u&&u.join?u[0]:u}}return n.next(),null}}function a(e,t){if(e===t)return!0;if(!e||"object"!=typeof e||!t||"object"!=typeof t)return!1;var n=0;for(var i in e)if(e.hasOwnProperty(i)){if(!t.hasOwnProperty(i)||!a(e[i],t[i]))return!1;n++}for(var i in t)t.hasOwnProperty(i)&&n--;return 0==n}function l(t,i,r,o){var l;if(r.persistent)for(var s=i.persistentStates;s&&!l;s=s.next)(r.spec?a(r.spec,s.spec):r.mode==s.mode)&&(l=s);var d=l?l.mode:r.mode||e.getMode(t,r.spec),c=l?l.state:e.startState(d);r.persistent&&!l&&(i.persistentStates={mode:d,spec:r.spec,state:c,next:i.persistentStates}),i.localState=c,i.local={mode:d,end:r.end&&n(r.end),endScan:r.end&&!1!==r.forceEnd&&n(r.end,!1),endToken:o&&o.join?o[o.length-1]:o}}function s(e,t){for(var n=0;n<t.length;n++)if(t[n]===e)return!0}function d(t,n){return function(i,r,o){if(i.local&&i.local.mode.indent)return i.local.mode.indent(i.localState,r,o);if(null==i.indent||i.local||n.dontIndentStates&&s(i.state,n.dontIndentStates)>-1)return e.Pass;var a=i.indent.length-1,l=t[i.state];e:for(;;){for(var d=0;d<l.length;d++){var c=l[d];if(c.data.dedent&&!1!==c.data.dedentIfLineStart){var S=c.regex.exec(r);if(S&&S[0]){a--,(c.next||c.push)&&(l=t[c.next||c.push]),r=r.slice(S[0].length);continue e}}}break}return a<0?0:i.indent[a]}}e.defineSimpleMode=function(t,n){e.defineMode(t,(function(t){return e.simpleMode(t,n)}))},e.simpleMode=function(n,i){t(i,"start");var a={},l=i.meta||{},s=!1;for(var c in i)if(c!=l&&i.hasOwnProperty(c))for(var S=a[c]=[],u=i[c],p=0;p<u.length;p++){var I=u[p];S.push(new r(I,i)),(I.indent||I.dedent)&&(s=!0)}var g={startState:function(){return{state:"start",pending:null,local:null,localState:null,indent:s?[]:null}},copyState:function(t){var n={state:t.state,pending:t.pending,local:t.local,localState:null,indent:t.indent&&t.indent.slice(0)};t.localState&&(n.localState=e.copyState(t.local.mode,t.localState)),t.stack&&(n.stack=t.stack.slice(0));for(var i=t.persistentStates;i;i=i.next)n.persistentStates={mode:i.mode,spec:i.spec,state:i.state==t.localState?n.localState:e.copyState(i.mode,i.state),next:n.persistentStates};return n},token:o(a,n),innerMode:function(e){return e.local&&{mode:e.local.mode,state:e.localState}},indent:d(a,l)};if(l)for(var E in l)l.hasOwnProperty(E)&&(g[E]=l[E]);return g}}(n(2742))},19973:function(e,t,n){!function(e){"use strict";e.defineSimpleMode("nsis",{start:[{regex:/(?:[+-]?)(?:0x[\d,a-f]+)|(?:0o[0-7]+)|(?:0b[0,1]+)|(?:\d+.?\d*)/,token:"number"},{regex:/"(?:[^\\"]|\\.)*"?/,token:"string"},{regex:/'(?:[^\\']|\\.)*'?/,token:"string"},{regex:/`(?:[^\\`]|\\.)*`?/,token:"string"},{regex:/^\s*(?:\!(addincludedir|addplugindir|appendfile|cd|define|delfile|echo|error|execute|finalize|getdllversion|gettlbversion|include|insertmacro|macro|macroend|makensis|packhdr|pragma|searchparse|searchreplace|system|tempfile|undef|uninstfinalize|verbose|warning))\b/i,token:"keyword"},{regex:/^\s*(?:\!(if(?:n?def)?|ifmacron?def|macro))\b/i,token:"keyword",indent:!0},{regex:/^\s*(?:\!(else|endif|macroend))\b/i,token:"keyword",dedent:!0},{regex:/^\s*(?:Abort|AddBrandingImage|AddSize|AllowRootDirInstall|AllowSkipFiles|AutoCloseWindow|BGFont|BGGradient|BrandingText|BringToFront|Call|CallInstDLL|Caption|ChangeUI|CheckBitmap|ClearErrors|CompletedText|ComponentText|CopyFiles|CRCCheck|CreateDirectory|CreateFont|CreateShortCut|Delete|DeleteINISec|DeleteINIStr|DeleteRegKey|DeleteRegValue|DetailPrint|DetailsButtonText|DirText|DirVar|DirVerify|EnableWindow|EnumRegKey|EnumRegValue|Exch|Exec|ExecShell|ExecShellWait|ExecWait|ExpandEnvStrings|File|FileBufSize|FileClose|FileErrorText|FileOpen|FileRead|FileReadByte|FileReadUTF16LE|FileReadWord|FileWriteUTF16LE|FileSeek|FileWrite|FileWriteByte|FileWriteWord|FindClose|FindFirst|FindNext|FindWindow|FlushINI|GetCurInstType|GetCurrentAddress|GetDlgItem|GetDLLVersion|GetDLLVersionLocal|GetErrorLevel|GetFileTime|GetFileTimeLocal|GetFullPathName|GetFunctionAddress|GetInstDirError|GetKnownFolderPath|GetLabelAddress|GetTempFileName|GetWinVer|Goto|HideWindow|Icon|IfAbort|IfErrors|IfFileExists|IfRebootFlag|IfRtlLanguage|IfShellVarContextAll|IfSilent|InitPluginsDir|InstallButtonText|InstallColors|InstallDir|InstallDirRegKey|InstProgressFlags|InstType|InstTypeGetText|InstTypeSetText|Int64Cmp|Int64CmpU|Int64Fmt|IntCmp|IntCmpU|IntFmt|IntOp|IntPtrCmp|IntPtrCmpU|IntPtrOp|IsWindow|LangString|LicenseBkColor|LicenseData|LicenseForceSelection|LicenseLangString|LicenseText|LoadAndSetImage|LoadLanguageFile|LockWindow|LogSet|LogText|ManifestDPIAware|ManifestLongPathAware|ManifestMaxVersionTested|ManifestSupportedOS|MessageBox|MiscButtonText|Name|Nop|OutFile|Page|PageCallbacks|PEAddResource|PEDllCharacteristics|PERemoveResource|PESubsysVer|Pop|Push|Quit|ReadEnvStr|ReadINIStr|ReadRegDWORD|ReadRegStr|Reboot|RegDLL|Rename|RequestExecutionLevel|ReserveFile|Return|RMDir|SearchPath|SectionGetFlags|SectionGetInstTypes|SectionGetSize|SectionGetText|SectionIn|SectionSetFlags|SectionSetInstTypes|SectionSetSize|SectionSetText|SendMessage|SetAutoClose|SetBrandingImage|SetCompress|SetCompressor|SetCompressorDictSize|SetCtlColors|SetCurInstType|SetDatablockOptimize|SetDateSave|SetDetailsPrint|SetDetailsView|SetErrorLevel|SetErrors|SetFileAttributes|SetFont|SetOutPath|SetOverwrite|SetRebootFlag|SetRegView|SetShellVarContext|SetSilent|ShowInstDetails|ShowUninstDetails|ShowWindow|SilentInstall|SilentUnInstall|Sleep|SpaceTexts|StrCmp|StrCmpS|StrCpy|StrLen|SubCaption|Target|Unicode|UninstallButtonText|UninstallCaption|UninstallIcon|UninstallSubCaption|UninstallText|UninstPage|UnRegDLL|Var|VIAddVersionKey|VIFileVersion|VIProductVersion|WindowIcon|WriteINIStr|WriteRegBin|WriteRegDWORD|WriteRegExpandStr|WriteRegMultiStr|WriteRegNone|WriteRegStr|WriteUninstaller|XPStyle)\b/i,token:"keyword"},{regex:/^\s*(?:Function|PageEx|Section(?:Group)?)\b/i,token:"keyword",indent:!0},{regex:/^\s*(?:(Function|PageEx|Section(?:Group)?)End)\b/i,token:"keyword",dedent:!0},{regex:/\b(?:ARCHIVE|FILE_ATTRIBUTE_ARCHIVE|FILE_ATTRIBUTE_HIDDEN|FILE_ATTRIBUTE_NORMAL|FILE_ATTRIBUTE_OFFLINE|FILE_ATTRIBUTE_READONLY|FILE_ATTRIBUTE_SYSTEM|FILE_ATTRIBUTE_TEMPORARY|HIDDEN|HKCC|HKCR(32|64)?|HKCU(32|64)?|HKDD|HKEY_CLASSES_ROOT|HKEY_CURRENT_CONFIG|HKEY_CURRENT_USER|HKEY_DYN_DATA|HKEY_LOCAL_MACHINE|HKEY_PERFORMANCE_DATA|HKEY_USERS|HKLM(32|64)?|HKPD|HKU|IDABORT|IDCANCEL|IDD_DIR|IDD_INST|IDD_INSTFILES|IDD_LICENSE|IDD_SELCOM|IDD_UNINST|IDD_VERIFY|IDIGNORE|IDNO|IDOK|IDRETRY|IDYES|MB_ABORTRETRYIGNORE|MB_DEFBUTTON1|MB_DEFBUTTON2|MB_DEFBUTTON3|MB_DEFBUTTON4|MB_ICONEXCLAMATION|MB_ICONINFORMATION|MB_ICONQUESTION|MB_ICONSTOP|MB_OK|MB_OKCANCEL|MB_RETRYCANCEL|MB_RIGHT|MB_RTLREADING|MB_SETFOREGROUND|MB_TOPMOST|MB_USERICON|MB_YESNO|MB_YESNOCANCEL|NORMAL|OFFLINE|READONLY|SHCTX|SHELL_CONTEXT|SW_HIDE|SW_SHOWDEFAULT|SW_SHOWMAXIMIZED|SW_SHOWMINIMIZED|SW_SHOWNORMAL|SYSTEM|TEMPORARY)\b/i,token:"atom"},{regex:/\b(?:admin|all|amd64-unicode|auto|both|bottom|bzip2|components|current|custom|directory|false|force|hide|highest|ifdiff|ifnewer|instfiles|lastused|leave|left|license|listonly|lzma|nevershow|none|normal|notset|off|on|right|show|silent|silentlog|textonly|top|true|try|un\.components|un\.custom|un\.directory|un\.instfiles|un\.license|uninstConfirm|user|Win10|Win7|Win8|WinVista|x-86-(ansi|unicode)|zlib)\b/i,token:"builtin"},{regex:/\$\{(?:And(?:If(?:Not)?|Unless)|Break|Case(?:Else)?|Continue|Default|Do(?:Until|While)?|Else(?:If(?:Not)?|Unless)?|End(?:If|Select|Switch)|Exit(?:Do|For|While)|For(?:Each)?|If(?:Cmd|Not(?:Then)?|Then)?|Loop(?:Until|While)?|Or(?:If(?:Not)?|Unless)|Select|Switch|Unless|While)\}/i,token:"variable-2",indent:!0},{regex:/\$\{(?:BannerTrimPath|DirState|DriveSpace|Get(BaseName|Drives|ExeName|ExePath|FileAttributes|FileExt|FileName|FileVersion|Options|OptionsS|Parameters|Parent|Root|Size|Time)|Locate|RefreshShellIcons)\}/i,token:"variable-2",dedent:!0},{regex:/\$\{(?:Memento(?:Section(?:Done|End|Restore|Save)?|UnselectedSection))\}/i,token:"variable-2",dedent:!0},{regex:/\$\{(?:Config(?:Read|ReadS|Write|WriteS)|File(?:Join|ReadFromEnd|Recode)|Line(?:Find|Read|Sum)|Text(?:Compare|CompareS)|TrimNewLines)\}/i,token:"variable-2",dedent:!0},{regex:/\$\{(?:(?:At(?:Least|Most)|Is)(?:ServicePack|Win(?:7|8|10|95|98|200(?:0|3|8(?:R2)?)|ME|NT4|Vista|XP))|Is(?:NT|Server))\}/i,token:"variable",dedent:!0},{regex:/\$\{(?:StrFilterS?|Version(?:Compare|Convert)|Word(?:AddS?|Find(?:(?:2|3)X)?S?|InsertS?|ReplaceS?))\}/i,token:"variable-2",dedent:!0},{regex:/\$\{(?:RunningX64)\}/i,token:"variable",dedent:!0},{regex:/\$\{(?:Disable|Enable)X64FSRedirection\}/i,token:"variable-2",dedent:!0},{regex:/(#|;).*/,token:"comment"},{regex:/\/\*/,token:"comment",next:"comment"},{regex:/[-+\/*=<>!]+/,token:"operator"},{regex:/\$\w[\w\.]*/,token:"variable"},{regex:/\${[\!\w\.:-]+}/,token:"variable-2"},{regex:/\$\([\!\w\.:-]+\)/,token:"variable-3"}],comment:[{regex:/.*?\*\//,token:"comment",next:"start"},{regex:/.*/,token:"comment"}],meta:{electricInput:/^\s*((Function|PageEx|Section|Section(Group)?)End|(\!(endif|macroend))|\$\{(End(If|Unless|While)|Loop(Until)|Next)\})$/i,blockCommentStart:"/*",blockCommentEnd:"*/",lineComment:["#",";"]}}),e.defineMIME("text/x-nsis","nsis")}(n(2742),n(77097))}}]);
//# sourceMappingURL=9973.03992230.chunk.js.map