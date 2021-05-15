import React, { useEffect, useState, forwardRef } from "react";
import instanciaAxios from "./ajax/instanciaAxios";
import './index.css'
import { ReactSortable } from "react-sortablejs";

const ListaTarefas = () => {


    const [listaCategorias, setListaCategorias] = useState([]);
    const [listaVencimentos, setListaVencimentos] = useState([]);
    const [listaInvestimentos, setListaInvestimentos] = useState([]);
    const [pegarData, setPegarData] = useState("");
    const [novaCategoria, setNovaCategoria] =useState("");
    const [codigoInvestimento, setCodigoInvestimento] = useState("");
    const [valorInvestimento, setValorInvestimento] = useState("");
    const [quantidadeInvestimento, setQuantidadeInvestimento] = useState("");
    const [novoVencimento, setNovoVencimento] = useState("");


    // chamadas assíncronas

    const pegarCategorias = async () => {
          

        try {
            const resposta = await instanciaAxios.get('../json/categorias.json');

            setListaCategorias(resposta.data.categorias);

        } catch (error) {
            console.log(`Houve um problema! Erro: ${error.message}`);
        }
    };



    const pegarVencimentos = async () => {

        try {
            const resposta = await instanciaAxios.get('../json/vencimento.json');

            setListaVencimentos(resposta.data.vencimentos);

        } catch (error) {
            console.log(`Houve um problema! Erro: ${error.message}`);
        }
    };



    const pegarInvestimentos = async () => {

        try {
            const resposta = await instanciaAxios.get('../json/investimentos.json');

            setListaInvestimentos(resposta.data.investimentos);

        } catch (error) {
            console.log(`Houve um problema! Erro: ${error.message}`);
        }
    };

// fim das chamadas assíncronas


    useEffect(() => {
        pegarCategorias();
        pegarVencimentos();
        pegarInvestimentos();
    }, []);



    const OpcoesCategorias = () => {

        if ( listaCategorias.length > 0) {
            const listaCategoriasJSX = listaCategorias.map((item) => {
                return (
                    <option value={item.id} key={item.id}>
                        {item.descricao}
                    </option>
                )
            });

            return listaCategoriasJSX;
        } else {
            return null;
        }
    };


    const OpcoesVencimentos = () => {

        if (listaVencimentos.length > 0) {
            const listaVencimentosJSX = listaVencimentos.map((item) => {
                return (
                    <label htmlFor={item.id} key={item.id}><input  type="radio" value={item.id} required name="periodo" id={item.valor} checked= { novoVencimento === item.id}
                    onChange={(event) => setNovoVencimento(event.target.value)}/>{item.descricao}</label>                   
                )
            });

            return listaVencimentosJSX;
        } else {
            return null;
        }
    };




    const CorpoTabela = () => {

        // const CustomComponent = forwardRef((props, ref) => {
        //     return <tbody ref={ref}>{props.children}</tbody>;
        //   });

        if (listaInvestimentos.length > 0) {
            return (
                 <tbody>
                   {/* <ReactSortable list={listaInvestimentos} setList={setListaInvestimentos} 
                      animation={200}
                     delayOnTouchStart={true}
                      delay={2}
                      tag= {CustomComponent}> */}

                    
    
           
                    {listaInvestimentos.map((item) => {
                        return (
                            <LinhaTabela
                                key={item.id}
                                id={item.id}
                                codigo={item.codigo}
                                categoria={item.idCategoria}
                                valor={item.idValorInvestido}
                                quantidade={item.idQuantidade}
                                data= {item.idDataAquisição}
                                vencimento={item.idVencimento}                               
                            />
                        );
                    })}
                   {/* </ReactSortable> */}
                  </tbody>
            );
        }else {
            return null;
        }
    };

    const LinhaTabela = (props) => {

        const categoriaInvestimento = listaCategorias.find(item => {
            return item.id === props.categoria;
        });

        const categoriaVencimentos = listaVencimentos.find(item => {
            return item.id === props.vencimento;
        });


        return (
            <tr className="corpo-tabela">
                <td>{props.codigo}</td>
                <td>{categoriaInvestimento.descricao}</td>
                <td>R$ {props.valor}</td>
                <td>{props.quantidade}</td>
                <td>{props.data}</td>
                <td>{categoriaVencimentos.descricao}</td>
                <td>
                    <img src="/images/cancel.png" alt="ícone para deletar investimento" className="remover"
                    onClick={ () => removerItem(props.id)}/>
                </td>
            </tr>
         

        );
    };

    // Inserindo novos itens na tabela

    const inserirItem = (event) => {
        
         event.preventDefault();

        if (novaCategoria && novoVencimento && codigoInvestimento && valorInvestimento && quantidadeInvestimento && pegarData) {


            const novoInvestimento = {
                "id": listaInvestimentos.length + 1,
                "codigo": codigoInvestimento,
                "idCategoria": novaCategoria,
                "idValorInvestido": parseInt(valorInvestimento),
                "idQuantidade": quantidadeInvestimento,
                "idDataAquisição": pegarData.split("-").reverse().join("/"),
                "idVencimento": novoVencimento,
                "idPrioridade": "ligado"
            }
            
            setListaInvestimentos( [...listaInvestimentos, novoInvestimento] );

        } else {
            alert("Preencha todos os dados corretamente!")
        }
    }
    
    // Removendo itens da tabela

    const removerItem = (id) => {
        
        const _listaInvestimentos = listaInvestimentos.filter( (item) => {
            return item.id !== id;
        });
        setListaInvestimentos(_listaInvestimentos);
    }

    // Lógica para pegar valor investido

    const somaQuantidade = listaInvestimentos.reduce( (soma, item) => item.idValorInvestido + soma, 0);

    


    //Começa abaixo o jSX 

    return (
    <> {/* ReactFragment */}
        <div id="container">
            <section id="primeira-parte">
                <form action="" onSubmit={event => event.preventDefault()}>
                    <div className="primeira-divisao">
                        <div className="investimento">
                            <label className="investimento-label" htmlFor="investimento">Investimento: </label>
                            <input type="text" className="investimento-input" name="investimento" placeholder="Somente código do investimento" value={codigoInvestimento}
                            required onChange={ (event) => setCodigoInvestimento(event.target.value) } />
                        </div>                  
                        <div className="investimento">
                            <label htmlFor="categoria" className="investimento-label">Categorias: </label>
                            <select name="categoria" value={novaCategoria || ""} className="investimento-input" onChange={ (event) => setNovaCategoria(event.target.value) }>
                                <option disabled >Selecione uma opção</option>
                                <OpcoesCategorias />
                            </select>
                        </div>
                        <div className="investimento">
                            <label className="investimento-label" htmlFor="investimento">Valor investido: </label>
                            <input type="number" className="investimento-input" name="investimento"  required onChange={ (event) => setValorInvestimento(event.target.value) } />
                        </div>
                        <div className="investimento">
                            <label className="investimento-label" htmlFor="investimento">Quantidade: </label>
                            <input type="number" className="investimento-input" name="investimento"  required onChange={ (event) => setQuantidadeInvestimento(event.target.value) } />
                        </div>
                        <div className="investimento">
                            <label className="investimento-label" htmlFor="data">Data de aquisição: </label>
                            <input type="date" min="2010-01-01" className="investimento-input" required onChange={ (event) => setPegarData(event.target.value) } />
                        </div>
                        <div className="investimento">
                            <label className="investimento-label" htmlFor="valor">Vencimento: </label>
                            <div className="vencimento-input">
                            <OpcoesVencimentos />
                            </div>
                        </div>
                        <div className="alerta-prioridade">
                            <input type="checkbox" name="prioridade" />
                            <label htmlFor="prioridade">Prioridade</label>
                        </div>
                            <button id="botao-inserir" type="submit" onClick={ (event) => inserirItem(event) }>Inserir</button>
                    </div>
                </form>
            </section>
            <section id="segunda-parte">
                <table id="tabela">
                    <thead>
                        <tr>
                            <th>Investimento</th>
                            <th>Categoria</th>
                            <th>Valor investido</th>
                            <th>Quantidade</th>
                            <th>Data de aquisição</th>
                            <th>Vencimento</th>
                            <th>Remover</th>
                        </tr>
                    </thead>
                    <CorpoTabela />
                    <tfoot>
                        <tr>
                            <td colSpan="7" id="rodape-tabela">Total de investimentos: R$ {somaQuantidade}</td>
                        </tr>
                    </tfoot>
                </table>
            </section>
        </div>

    </>
    );

}

export default ListaTarefas;