import dynamic from "next/dynamic"
import React, { useEffect } from 'react'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useState } from "react";
import { EditorState } from "draft-js"
import { db } from "../firebase";
import { useRouter } from "next/dist/client/router";
import { convertFromRaw, convertToRaw } from "draft-js";
import { useSession } from "next-auth/client";
import { useDocumentOnce } from "react-firebase-hooks/firestore";

// For rectifying the error -> Window Not Found!
const Editor = dynamic(() => import("react-draft-wysiwyg").then((module) => module.Editor), {
    ssr: false,
});

const TextEditor = () => {
    const [session] = useSession();
    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    const router = useRouter();
    const id = router.query.id;

    const [snapshot] = useDocumentOnce(
      db
        .collection("userDoc")
        .doc(session.user.email)
        .collection("docs")
        .doc(id)
    );
    
    // This code Executes only once to show the stored data from the server, We need to convert the Raw!
    useEffect(() => {
       if(snapshot?.data()?.editorState) {
           setEditorState(EditorState.createWithContent(
               convertFromRaw(snapshot?.data()?.editorState
               ?.blocks?.text)
           ))
       }
    }, [])

    const onEditorStateChange = (editorState) => {
      setEditorState(editorState);

      db.collection("userDoc").doc(session.user.email).collection("docs").doc(id).set({
        editorState: convertToRaw(editorState.getCurrentContent())
      }, {
        merge: true
      })
    };

    return (
      <div className="bg-[#F8F9FA] min-h-screen pb-16">
        <Editor 
          editorState={editorState}
          onEditorStateChange={onEditorStateChange}
          toolbarClassName="flex sticky top-0 z-50 !justify-center mx-auto"
          editorClassName="mt-6 p-10 bg-white shadow-lg max-w-5xl mx-auto mb-12 border"
        />
      </div>
    );
}

export default TextEditor
