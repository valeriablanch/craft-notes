import { ChangeEvent, useState } from 'react'
import logo from './assets/craft.svg'
import { NoteCard } from './components/note-card'
import { NewNote } from './components/new-note-card'

interface Note{
  id: string
  title: string
  date: Date
  content: string
}

export function App() {
  const [search, setSearch] = useState('')
  const notesOnStorage = localStorage.getItem('notes')
  const [notes, setNotes] = useState<Note[]>(() => {

    if(notesOnStorage){
      return JSON.parse(notesOnStorage)
    }
    return []
  })

  function onNoteCreated (title:string, content: string){
    const newNote = {
      id: crypto.randomUUID(),
      title,
      date: new Date(),
      content,
    }

    const notesArray = [newNote, ...notes]

    setNotes(notesArray)

    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  function onNoteDeleted (id: string){
    const notesArray = notes.filter(note => {
      return note.id != id
    })
    setNotes(notesArray)

    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  function handleSearch (event: ChangeEvent<HTMLInputElement>){
    const query = event.target.value

    setSearch(query)
  }

  const filteredNotes = search != ''
    ? ( 
    notes.filter(note => note.content.toLowerCase().includes(search.toLowerCase())), 
    notes.filter(note => note.title.toLowerCase().includes(search.toLowerCase()))
    ) : notes
  return (
    <div className='mx-auto max-w-6xl my-12 space-y-4 px-5'>
      <img className='w-40 h-15' src={logo} alt='Nota de voz'/>

      <form className='w-full'>
        <input type='text' placeholder='Buscar...' className='w-full bg-transparent text-[18px] leading-8 font-semibold tracking-tight outline-none placeholder:text-slate-400' onChange={handleSearch}/>
      </form>

      <div className='h-px bg-slate-700'/>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]'>

        {notesOnStorage === '[]' || !notesOnStorage ? ( 
          <span className='text-slate-600'>Suas notas aparecerão aqui.</span>
        ) : (
          filteredNotes.length === 0 ? (
            <span className='text-slate-600'>Nenhum resultado encontrado.</span>
          ) : (
            filteredNotes.map(note =>{
              return <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted}/>
            })
          )
        )}
        <NewNote onNoteCreated={onNoteCreated}/>
      </div>
    </div>
  )
}

