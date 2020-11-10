import React, {useState, useEffect} from 'react';
import { useForm } from 'react-hook-form'
import {Forms, Input, Row, Text, Titulo} from './style'
import Cards from '../cards'
import axios from 'axios'

 function Form() {
    const [cards, setCards] = useState([]);
    const [editCard, setEditCard] = useState();
    const [idEdit, setIdEdit] = useState();
    const [editando, setEditando] = useState(false);
    const { register, handleSubmit, reset } = useForm();
    

    useEffect(() => {
      async function refresh(){
        await axios.get("/notes").then(response => {
          setCards(response.data);
        })
      }
      refresh();
    });

    const onSubmit = async (data) => {
      try{
      await axios.post("/notes", {
        title : data.Titulo,
        content : data.Texto
      })
    }catch(error){
      console.log(error);
    }
      reset();
    }

     const deleteCard = async _id => {
      try{
      await axios.delete("/notes/"+_id)
      }catch(error){
        console.log(error);
      }
     } 

     const editarCard = _id => {
      const cardEditando = cards.filter((card) => card._id === _id);
      setEditCard(cardEditando[0]);
      setIdEdit({_id});
      setEditando(true);
     }

     const alterarInfo = async (data) => {
      const { Titulo, Texto } = data;
      const {_id} = idEdit;
      try{
      await axios.put("/notes/"+_id, {
        title : Titulo,
        content : Texto,
      })
     }catch(error){
      console.log(error);
      }
      reset();
      setEditando(false);
     }

    return (
      <div>
      {editando ? (
        <div>
        <Titulo>Editar anotação</Titulo>
        <Forms onSubmit={handleSubmit(alterarInfo)}>
          <Input type="text" defaultValue={editCard.title} placeholder="Titulo" name="Titulo" ref={register({required: true, maxLength: 80})} />
          <Text text placeholder="Anotação" defaultValue={editCard.content}  name="Texto" ref={register({required: true, maxLength: 200})} />
          <Input botao type="submit" value="Editar"/>
        </Forms>
        </div>
      ):(
      <div>
      <Titulo>Adicionar anotação</Titulo>
      <Forms onSubmit={handleSubmit(onSubmit)}>
        <Input type="text" id="Titulo" placeholder="Titulo" defaultValue="" name="Titulo" ref={register({required: true, maxLength: 80})} />
        <Text text placeholder="Anotação" id="Texto" defaultValue="" name="Texto" ref={register({required: true, maxLength: 200})} />
        <Input botao type="submit" value="Adicionar"/>
      </Forms>
      </div>
      )
      }
      <Row>
        <Cards cards={cards} deletar={deleteCard} editar={editarCard}/>
      </Row>
      </div>
    );
}

export default Form;