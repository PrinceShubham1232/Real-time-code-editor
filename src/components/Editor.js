import React, { useEffect, useRef } from 'react'
import Codemirror from 'codemirror'
import ACTIONS from "../Actions";
import 'codemirror/lib/codemirror.css'
import 'codemirror/lib/codemirror.js'
import 'codemirror/theme/dracula.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/clike/clike'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/closebrackets'



function Editor({socketRef,roomId,onCodeChange}){
    
    const editorRef=useRef(null);
    useEffect(()=>{
        async function init(){
            editorRef.current = Codemirror.fromTextArea(
                document.getElementById('realTimeEditor'),{
                mode: {name: 'clike',json: true},
                theme: 'dracula',
                autoCloseTags: true,
                autoCloseBrackets: true,
                lineNumbers: true,
            });

            editorRef.current.on('change',(instance,changes)=>{
                const {origin}=changes;
                const code= instance.getValue();
                onCodeChange(code);
                if(origin !== 'setValue'){
                    socketRef.current.emit(ACTIONS.CODE_CHANGE,{
                        roomId,
                        code,
                    });
                }
                // console.log(code);
            })
        }init();
    },[]);

            useEffect(() => {
                if (socketRef.current) {
                    socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                        if (code !== null) {
                            editorRef.current.setValue(code);
                        }
                    });
                }
        
                return () => {
                    socketRef.current.off(ACTIONS.CODE_CHANGE);
                };
            }, [socketRef.current]);
    
         
    return( 
        <textarea id ='realTimeEditor'></textarea>
    )
};

export default Editor;