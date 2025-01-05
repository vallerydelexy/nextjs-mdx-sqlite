import { useEffect, useState } from 'react';
export default function terminal(props) {
    function inputTerminal() {
        let terminal = document.querySelector('#terminalInput');
        terminal.focus();
    }
    function sendText(e) {
        
        let url = 'https://api.whatsapp.com/send/?phone=6281276763536&text='; 
        let key = e.keyCode || e.which;
        let terminal = document.querySelector('#terminalInput');
        let text = terminal.value;
        key == "13" && text ? location.href = url+text:null;
    }
    return (
        <div onClick={inputTerminal} className="coding inverse-toggle px-5 shadow-lg text-gray-100 text-sm font-mono subpixel-antialiased 
        bg-gray-800  pb-6 pt-4 rounded-lg leading-normal overflow-hidden">
            <div className="top mb-2 flex">
                <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                <div className="ml-2 h-3 w-3 bg-orange-300 rounded-full"></div>
                <div className="ml-2 h-3 w-3 bg-green-500 rounded-full"></div>
                <div className="ml-2 text-xs text-inherit pl-4"><span className='px-auto'>Whatsapp</span></div>
            </div>
            <div className="mt-4 flex">
                <div className="flex-1 typing items-center pl-2">
                    <span className="text-green-400"></span> {props.text}
                    <br />
                    <div className="flex">
                        <span className="whitespace-no-wrap text-green-400">Kirimkan pesan:  </span>
                        <input id="terminalInput" onKeyPress={sendText} className="pl-2 bg-inherit text-inherit outline-none flex-auto" type="text" />
                    </div>
                </div>
            </div>
        </div>
    )
}