import React from 'react';
import {Column, Card, Botao} from './style'

function Cards(props) {
  return (
    <>
    <div>
        {props.cards.map((card) => {
          const {_id, title, content} = card;
          return (
            <Column>
              <Card key={_id}>
                <h3>{title}</h3>
                <p>{content}</p>
                <Botao onClick={() => props.deletar(_id)} class="btn"><i class="fa fa-window-close"></i></Botao>
                <Botao onClick={() => props.editar(_id)} class="btn"><i class="fa fa-edit"></i></Botao>
              </Card>
            </Column>
          )
        })}
      </div>
    </>
  );
}

export default Cards;