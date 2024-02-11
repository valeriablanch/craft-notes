import * as Dialog from '@radix-ui/react-dialog'
import { X, Mic, Plus } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner'

interface NewNoteProps{
  onNoteCreated: (title:string, content: string) => void
}

export function NewNote({onNoteCreated}: NewNoteProps) {
  const [isRecording, SetIsRecording] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>){
    setContent(event.target.value)
  }

  function handleTitleChange (event: ChangeEvent<HTMLInputElement>){
    setTitle(event.target.value)
  }

  function handleSaveNote (event: FormEvent){
    event.preventDefault()

    if((content === '') || (title === '')){
      toast.info('Não foi possível salvar. Título ou conteúdo vazio.')
      return
    }else{
      onNoteCreated(title,content)
    }

    setContent('')
    setTitle('')

    toast.success('Nota criada com sucesso.')
  }

  function handleStartRecording () {
    const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window
      || 'webkitSpeechRecognition' in window

    if(!isSpeechRecognitionAPIAvailable){
      toast.error('Infelizmente seu navegador nao suporta a API de gravação.')
      return
    }

    SetIsRecording(true)

    let SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

    SpeechRecognitionAPI = new SpeechRecognitionAPI()

    SpeechRecognitionAPI.lang = 'pt-BR'
    SpeechRecognitionAPI.continuous = true //continue talking when I stopped talking
    SpeechRecognitionAPI.maxAlternatives = 1
    SpeechRecognitionAPI.interimResults = true //show the sentences while Im talking

    SpeechRecognitionAPI.onresult = (event: { results: Iterable<unknown> | ArrayLike<unknown> }) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      }, '')

      setContent(transcription)
    }

    SpeechRecognitionAPI.onerror = (event: any) => {
      console.error(event)
    }

    SpeechRecognitionAPI.start()
  }

  function handleStopRecording (){
    SetIsRecording(false)

    if(speechRecognitionAPI !== null){
      speechRecognitionAPI.stop()
    }
  }
  return (
    <Dialog.Root>
      <Dialog.Trigger className='fixed bottom-10 right-4 md:right-24 bg-pink-500 p-4 rounded-full text-black'>
        <Plus className='w-6 h-6'/>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className='inset-0 fixed bg-black/50'/>
        <Dialog.Content className='fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[512px] md:w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none'>
            <Dialog.Close className='absolute right-0 top-0 p-1.5 text-slate-400 hover:text-slate-100'>
              <X className='size-5'/>
            </Dialog.Close>
          <form className='flex-1 flex flex-col mt-5'>
            <div className='flex flex-1 flex-col gap-3 p-5'>
              <div className='flex justify-between items-center gap-3'>
                <input type='text' placeholder='Titulo' className='w-full bg-transparent text-lg font-semibold outline-none' onChange={handleTitleChange} value={title}/>
                {isRecording ? (
                  <button type='button' className='absolute right-10 bottom-20 p-1.5 text-red-400 bg-slate-800 rounded-full' onClick={handleStopRecording}><Mic className='size-4'/></button>
                ) : (
                  <button type="button" className='absolute right-10 bottom-20 p-1.5 bg-slate-800 rounded-full' onClick={handleStartRecording}><Mic className='size-4'/></button>
                  
                )}
              </div>
              {isRecording ? (
                <textarea autoFocus className='text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none' onChange={handleContentChange} value={content}/>
              ) : (
                <textarea placeholder='Escreva a sua nota aqui.' autoFocus className='text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none' onChange={handleContentChange} value={content}/>
              )}
                
            </div>
            
            {isRecording ? (
              <button disabled type='button' className= 'animate-pulse w-full bg-red-600 py-4 text-center text-sm text-gray-300 outline-none font-medium cursor-not-allowed'>
                Gravando...
              </button>
            ) : (
              <button type='button' className='w-full bg-pink-500 py-4 text-center text-sm text-pink-950 outline-none font-medium hover:bg-pink-400' onClick={handleSaveNote} >
                Salvar nota
              </button>
            )}

            
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}