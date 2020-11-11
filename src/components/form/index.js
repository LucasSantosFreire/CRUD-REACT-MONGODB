import React, {useState, useEffect} from 'react';
import { useForm } from 'react-hook-form'
import {Forms, Input, Row, Text, Titulo} from './style'
import Cards from '../cards'
import axios from 'axios'
import Modal from 'react-modal'

axios.defaults.baseURL = ''; {/*URL DO BACK AI CONSAGRADO*/}

 function Form() {
    const [cards, setCards] = useState([]);
    const [editCard, setEditCard] = useState();
    const [idEdit, setIdEdit] = useState();
    const [editando, setEditando] = useState(false);
    const [modal, setModal] = useState(false);
    const [modalInfo, setModalInfo] = useState({});
    const { register, handleSubmit, reset } = useForm();
    const { register: registerSearch, handleSubmit: handleSearch, reset: resetSearch } = useForm();
    

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


     const filtrar = async (data) => {
       const {_id} = data;
       try{
        await axios.get("/notes/"+_id).then(response => {
          resetSearch();
          setModal(true);
          setModalInfo(response.data);
        })
        }catch(error){
          resetSearch();
          alert("O id informado não existe.");
        }
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
      <div>
      <Titulo>Adicionar anotação</Titulo>
      <Forms onSubmit={handleSubmit(onSubmit)}>
        <Input type="text" id="Titulo" placeholder="Titulo" defaultValue="" name="Titulo" ref={register({required: true, maxLength: 80})} />
        <Text text placeholder="Anotação" id="Texto" defaultValue="" name="Texto" ref={register({required: true, maxLength: 200})} />
        <Input botao type="submit" value="Adicionar"/>
      </Forms>
      </div>  
    </div>
      )
      }
        <div>
          <Forms searchform onSubmit={handleSearch(filtrar)}>
            <Input searchbar type="text" id="_id" placeholder="Digite um id" defaultValue="" name="_id" ref={registerSearch({required: true, maxLength: 80})}></Input>
            <Input botao type="submit" value="Pesquisar"></Input>
          </Forms>
        </div>
        <did>
        <Modal className="Modal" isOpen={modal}>
          <h1>{modalInfo.title}</h1>
          <text>{modalInfo.content}</text>
          <button className="Botao" onClick={() => setModal(false)}>Fechar</button>
        </Modal>
      </did>
      <Row>
        <Cards cards={cards} deletar={deleteCard} editar={editarCard}/>
      </Row>
      </div>
    );
}

export default Form;
