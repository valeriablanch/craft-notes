import * as Dialog from '@radix-ui/react-dialog'
import { formatDistanceToNow } from 'date-fns'
import { pt } from 'date-fns/locale'
import { ArrowLeft , Trash2 } from 'lucide-react'

interface NoteCardProps{
  note:{
    id: string
    title: string
    date: Date
    content: string
  }
  onNoteDeleted: (id: string) => void
}

export function NoteCard({note, onNoteDeleted}: NoteCardProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className='rounded-md text-left flex flex-col bg-slate-800 p-5 gap-3 overflow-hidden relative hover:ring-2 hover:ring-slate-600 outline-none focus-visible:ring-2 focus-visible:ring-pink-400'>
        <div className='w-full flex justify-between items-center'>
            <span className='text-lg text-ellipsis whitespace-nowrap w-3/5 h-auto overflow-hidden'>{note.title}</span>
            <span className='text-[10px] font-medium text-slate-300 text-right'>
              {formatDistanceToNow(note.date, {locale: pt, addSuffix:true})} atrás
        
            </span>
        </div>
        <p
        
         className='text-sm leading-6 text-slate-400'>
          {note.content}
        </p>
        <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none' />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className='inset-0 fixed bg-black/50'/>
        <Dialog.Content className='fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] md:w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none p-5'>
          <div className='flex justify-between items-center'>
            <div className='flex gap-3 items-center'>
              <Dialog.Close>
                <span className='text-slate-50 hover:text-slate-400'><ArrowLeft  className='size-5 '/></span>
              </Dialog.Close>
              <button type='button' className='text-slate-50 hover:text-red-400' onClick={() => onNoteDeleted(note.id)}><Trash2  className='size-4 '/></button>
            </div>
            <span className='text-[12px] font-medium text-gray-400 text-right'>
                {formatDistanceToNow(note.date, {locale: pt, addSuffix:true})} atrás
            </span>
          </div>
          <div className='flex flex-1 flex-col gap-3 mt-2'>
            <span className='text-lg overflow-hidden'>{note.title}</span>
            <hr></hr>
            <p className='text-sm leading-6 text-slate-400'>
              {note.content}
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}