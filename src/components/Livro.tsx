import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faInfoCircle, faPlus, faEdit, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import StarRating from './StarRating';
import './Livro.css'

interface LivroType {
  id: string;
  titulo: string;
  autores: string;
  ano_lancamento: string;
  genero: string;
  sinopse: string;
  avaliacao: string;
  preco: string;
  imagem_capa: string;
}

function Livro() {
  const [livro, setLivro] = useState<LivroType>({
    id: '',
    titulo: '',
    autores: '',
    ano_lancamento: '',
    genero: '',
    sinopse: '',
    avaliacao: '',
    preco: '',
    imagem_capa: ''
  });

  const [livros, setLivros] = useState<LivroType[]>([]);
  const [atualizar, setAtualizar] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [addModal, setAddModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [ordemAscendente, setOrdemAscendente] = useState<boolean>(true);
  const [ordemAutoresAscendente, setOrdemAutoresAscendente] = useState<boolean>(true);
  const [ordemAvaliacaoAscendente, setOrdemAvaliacaoAscendente] = useState<boolean>(true);
  const [ordemPrecoAscendente, setOrdemPrecoAscendente] = useState<boolean>(true);

  const limparCampos = () => {
    setLivro({
      id: '',
      titulo: '',
      autores: '',
      ano_lancamento: '',
      genero: '',
      sinopse: '',
      avaliacao: '',
      preco: '',
      imagem_capa: ''
    });
  };

  useEffect(() => {
    axios.get<LivroType[]>("https://sistema-livraria-spring-boot.onrender.com/livros")
      .then(result => {
        setLivros(result.data);
      })
      .catch(error => console.error("Erro ao carregar livros:", error));
  }, [atualizar]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setLivro({ ...livro, [event.target.name]: event.target.value });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    axios.post("https://sistema-livraria-spring-boot.onrender.com/livros", livro)
      .then(() => {
        setAtualizar(!atualizar);
        setAddModal(false);
        toast.success("Livro adicionado com sucesso!");
        limparCampos();
      })
      .catch(() => {
        toast.error("Erro ao adicionar livro. Verifique os dados e tente novamente.");
      });
  }

  function excluir(id: string) {
    axios.delete(`https://sistema-livraria-spring-boot.onrender.com/livros/${id}`)
      .then(() => {
        setAtualizar(!atualizar);
        toast.success("Livro removido com sucesso!");
      })
      .catch(error => {
        console.error("Erro ao excluir livro:", error);
        toast.error("Erro ao excluir livro. Tente novamente mais tarde.");
      });
  }

  function showDetails(livro: LivroType) {
    setLivro(livro);
    setOpenModal(true);
  }

  function hideModal() {
    setOpenModal(false);
    setAddModal(false);
    setEditModal(false);
  }

  function showAddModal() {
    limparCampos();
    setAddModal(true);
  }

  function showEditModal() {
    setEditModal(true);
  }

  function editarLivro() {
    axios.put(`https://sistema-livraria-spring-boot.onrender.com/livros/${livro.id}`, livro)
      .then(() => {
        setAtualizar(!atualizar);
        toast.success("Livro editado com sucesso!");
        setEditModal(false);
      })
      .catch(() => {
        toast.error("Erro ao editar livro. Verifique os dados e tente novamente.");
      });
  }

  function ordenarPorId() {
    const livrosOrdenados = [...livros];
  
    if (ordemAscendente) {
      livrosOrdenados.sort((a, b) => parseInt(a.id) - parseInt(b.id));
    } else {
      livrosOrdenados.sort((a, b) => parseInt(b.id) - parseInt(a.id));
    }
  
    setLivros(livrosOrdenados);
    setOrdemAscendente(!ordemAscendente);
  }

  function ordenarPorAutores() {
    const livrosOrdenados = [...livros];
  
    if (ordemAutoresAscendente) {
      livrosOrdenados.sort((a, b) => a.autores.localeCompare(b.autores));
    } else {
      livrosOrdenados.sort((a, b) => b.autores.localeCompare(a.autores));
    }
  
    setLivros(livrosOrdenados);
    setOrdemAutoresAscendente(!ordemAutoresAscendente);
  }

  function ordenarPorAvaliacao() {
    const livrosOrdenados = [...livros];
  
    if (ordemAvaliacaoAscendente) {
      livrosOrdenados.sort((a, b) => parseFloat(a.avaliacao) - parseFloat(b.avaliacao));
    } else {
      livrosOrdenados.sort((a, b) => parseFloat(b.avaliacao) - parseFloat(a.avaliacao));
    }
  
    setLivros(livrosOrdenados);
    setOrdemAvaliacaoAscendente(!ordemAvaliacaoAscendente);
  }

  function ordenarPorPreco() {
    const livrosOrdenados = [...livros];
  
    if (ordemPrecoAscendente) {
      livrosOrdenados.sort((a, b) => parseFloat(a.preco) - parseFloat(b.preco));
    } else {
      livrosOrdenados.sort((a, b) => parseFloat(b.preco) - parseFloat(a.preco));
    }
  
    setLivros(livrosOrdenados);
    setOrdemPrecoAscendente(!ordemPrecoAscendente);
  }

  return (
    <div className='livros-container'>
      <div className="d-flex justify-content-between align-items-center">
        <h2>Livros</h2>
        <button onClick={showAddModal} className='btn btn-dark'>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      <br />

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th scope="col">
              #
              <button onClick={ordenarPorId} className='btn btn-dark btn-sm float-end'>
                <FontAwesomeIcon icon={faSortDown} />
              </button>
            </th>
            <th scope="col">Título
              <button onClick={showEditModal} className='btn btn-dark btn-sm float-end'>
                <FontAwesomeIcon icon={faSortDown} />
              </button></th>
              <th scope="col">Autores
                <button onClick={ordenarPorAutores} className='btn btn-dark btn-sm float-end'>
                  <FontAwesomeIcon icon={faSortDown} />
                </button>
              </th>
              <th scope="col">Avaliação
                <button onClick={ordenarPorAvaliacao} className='btn btn-dark btn-sm float-end'>
                  <FontAwesomeIcon icon={faSortDown} />
                </button>
              </th>
              <th scope="col">Preço
                <button onClick={ordenarPorPreco} className='btn btn-dark btn-sm float-end'>
                  <FontAwesomeIcon icon={faSortDown} />
                </button>
              </th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {livros.map(liv => (
            <tr key={liv.id}>
              <td>{liv.id}</td>
              <td>{liv.titulo}</td>
              <td>{liv.autores}</td>
              <td>
                 <StarRating rating={Number(liv.avaliacao)} />
              </td>
              <td>R$ {Number(liv.preco).toFixed(2)}</td>
              <td>
                <button onClick={() => showDetails(liv)} className='btn btn-light'>
                  <FontAwesomeIcon icon={faInfoCircle} />
                </button>
                <button onClick={() => excluir(liv.id)} className='btn btn-light mr-2'>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {openModal && (
        <Modal show={openModal} onHide={hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>Detalhes do Livro</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img src={livro.imagem_capa} alt="Capa do Livro"></img>
            <br/><br/>
            <p><strong>Título:</strong> {livro.titulo}</p>
            <p><strong>Autor(es):</strong> {livro.autores}</p>
            <p><strong>Ano de Lançamento:</strong> {livro.ano_lancamento}</p>
            <p><strong>Gênero:</strong> {livro.genero}</p>
            <p><strong>Sinopse:</strong> {livro.sinopse}</p>
            <p>
              <strong>Avaliação: </strong>
              <StarRating rating={Number(livro.avaliacao)} />
            </p>
            <p><strong>Preço:</strong> R$ {Number(livro.preco).toFixed(2)}</p>
            <button onClick={showEditModal} className='btn btn-primary'>
              <FontAwesomeIcon icon={faEdit} /> Editar
            </button>
          </Modal.Body>
        </Modal>
      )}

      {addModal && (
        <Modal show={addModal} onHide={hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>Adicionar Livro</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formTitulo">
                <Form.Label>Título</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Insira o título"
                  name="titulo"
                  value={livro.titulo}
                  onChange={handleChange}
                /> <br/>
              </Form.Group>
              <Form.Group controlId="formAutores">
                <Form.Label>Autor(es)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Insira o(s) autor(es)"
                  name="autores"
                  value={livro.autores}
                  onChange={handleChange}
                /> <br/>
              </Form.Group>
              <Form.Group controlId="formAnoLancamento">
                <Form.Label>Ano de Lançamento</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Insira o ano de publicação"
                  name="ano_lancamento"
                  value={livro.ano_lancamento}
                  onChange={handleChange}
                /> <br/>
              </Form.Group>
              <Form.Group controlId="formGenero">
                <Form.Label>Gênero</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Insira o gênero"
                  name="genero"
                  value={livro.genero}
                  onChange={handleChange}
                /> <br/>
              </Form.Group>
              <Form.Group controlId="formSinopse">
                <Form.Label>Sinopse</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Insira a sinopse"
                  name="sinopse"
                  value={livro.sinopse}
                  onChange={handleChange}
                /> <br/>
              </Form.Group>
              <Form.Group controlId="formAvaliacao">
                <Form.Label>Avaliação</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Insira a avaliação"
                  name="avaliacao"
                  value={livro.avaliacao}
                  onChange={handleChange}
                /> <br/>
              </Form.Group>
              <Form.Group controlId="formPreco">
                <Form.Label>Preço</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Insira o preço"
                  name="preco"
                  value={livro.preco}
                  onChange={handleChange}
                /> <br/>
              </Form.Group>
              <Form.Group controlId="formImagem_capa">
                <Form.Label>Imagem de capa</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Insira o link da imagem de capa"
                  name="imagem_capa"
                  value={livro.imagem_capa}
                  onChange={handleChange}
                /> <br/>
              </Form.Group>
              <Button variant="primary" type="submit" >
                Adicionar
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}

      {editModal && (
        <Modal show={editModal} onHide={hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Livro</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={editarLivro}>
              <Form.Group controlId="formTitulo">
                <Form.Label>Título</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Insira o título"
                  name="titulo"
                  value={livro.titulo}
                  onChange={handleChange}
                /> <br/>
              </Form.Group>
              <Form.Group controlId="formAutores">
                <Form.Label>Autor(es)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Insira o(s) autor(es)"
                  name="autores"
                  value={livro.autores}
                  onChange={handleChange}
                /> <br/>
              </Form.Group>
              <Form.Group controlId="formAnoLancamento">
                <Form.Label>Ano de Lançamento</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Insira o ano de publicação"
                  name="ano_lancamento"
                  value={livro.ano_lancamento}
                  onChange={handleChange}
                /> <br/>
              </Form.Group>
              <Form.Group controlId="formGenero">
                <Form.Label>Gênero</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Insira o gênero"
                  name="genero"
                  value={livro.genero}
                  onChange={handleChange}
                /> <br/>
              </Form.Group>
              <Form.Group controlId="formSinopse">
                <Form.Label>Sinopse</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Insira a sinopse"
                  name="sinopse"
                  value={livro.sinopse}
                  onChange={handleChange}
                /> <br/>
              </Form.Group>
              <Form.Group controlId="formAvaliacao">
                <Form.Label>Avaliação</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Insira a avaliação"
                  name="avaliacao"
                  value={livro.avaliacao}
                  onChange={handleChange}
                /> <br/>
              </Form.Group>
              <Form.Group controlId="formPreco">
                <Form.Label>Preço</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Insira o preço"
                  name="preco"
                  value={livro.preco}
                  onChange={handleChange}
                /> <br/>
              </Form.Group>
              <Form.Group controlId="formImagem_capa">
                <Form.Label>Imagem de capa</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Insira o link da imagem de capa"
                  name="imagem_capa"
                  value={livro.imagem_capa}
                  onChange={handleChange}
                /> <br/>
              </Form.Group>
              <Button variant="primary" type="submit">
                Salvar Edições
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}

      <ToastContainer />
    </div>
  );
}

export default Livro;