import { useRef, useState } from 'react';
import './App.css';

const estudiantesIniciales = [{ id: 1, nombre: 'Ana', nota: 4.5 }];

const clasesPorVariante = {
  primario: 'boton boton--primario',
  secundario: 'boton boton--secundario',
  peligro: 'boton boton--peligro',
};

function Boton({ variante = 'primario', children, texto, className = '', ...props }) {
  return (
    <button
      className={[clasesPorVariante[variante], className].filter(Boolean).join(' ')}
      {...props}
    >
      {children ?? texto}
    </button>
  );
}

function App() {
  const [estudiantes, setEstudiantes] = useState(estudiantesIniciales);
  const [nombre, setNombre] = useState('');
  const [nota, setNota] = useState('');
  const [error, setError] = useState('');
  const siguienteId = useRef(2);
  const aprobados = estudiantes.filter((estudiante) => estudiante.nota >= 3).length;

  function agregarEstudiante(event) {
    event.preventDefault();

    const nombreLimpio = nombre.trim();
    const notaNumerica = Number(nota);

    if (!nombreLimpio) {
      setError('Escribe el nombre del estudiante.');
      return;
    }

    if (!nota.trim() || !Number.isFinite(notaNumerica) || notaNumerica < 0 || notaNumerica > 5) {
      setError('La nota debe ser un número entre 0 y 5.');
      return;
    }

    setEstudiantes((actuales) => [
      ...actuales,
      { id: siguienteId.current++, nombre: nombreLimpio, nota: notaNumerica },
    ]);
    setNombre('');
    setNota('');
    setError('');
  }

  function eliminarEstudiante(id) {
    setEstudiantes((actuales) => actuales.filter((estudiante) => estudiante.id !== id));
  }

  function limpiarFormulario() {
    setNombre('');
    setNota('');
    setError('');
  }

  return (
    <main className="app-shell">
      <header className="encabezado">
        <p className="eyebrow">Unidad 3.1 · Taller individual de React</p>
        <h1>Sistema académico</h1>
        <p className="subtitulo">Registra estudiantes y consulta su rendimiento.</p>
      </header>

      <section className="resumen" aria-label="Resumen de aprobados">
        <span className="resumen__numero">{aprobados}</span>
        <div>
          <h2>Estudiantes aprobados</h2>
          <p>Se aprueba con una nota igual o superior a 3.0.</p>
        </div>
      </section>

      <section className="panel" aria-labelledby="formulario-titulo">
        <div className="panel__encabezado">
          <div>
            <p className="eyebrow">Nuevo registro</p>
            <h2 id="formulario-titulo">Agregar estudiante</h2>
          </div>
        </div>

        <form className="formulario" onSubmit={agregarEstudiante} noValidate>
          <div className="campo">
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              placeholder="Ej. María Gómez"
              autoComplete="name"
              required
              aria-invalid={Boolean(error)}
            />
          </div>

          <div className="campo">
            <label htmlFor="nota">Nota (0 a 5)</label>
            <input
              id="nota"
              name="nota"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={nota}
              onChange={(event) => setNota(event.target.value)}
              placeholder="Ej. 4.2"
              required
              aria-invalid={Boolean(error)}
            />
          </div>

          {error && (
            <p className="formulario__error" role="alert">
              {error}
            </p>
          )}

          <div className="formulario__acciones">
            <Boton type="submit" variante="primario">
              Agregar estudiante
            </Boton>
            <Boton type="button" variante="secundario" onClick={limpiarFormulario}>
              Limpiar
            </Boton>
          </div>
        </form>
      </section>

      <section className="panel" aria-labelledby="lista-titulo">
        <div className="panel__encabezado">
          <div>
            <p className="eyebrow">Registro académico</p>
            <h2 id="lista-titulo">Estudiantes</h2>
          </div>
          <span className="lista__total">{estudiantes.length} en total</span>
        </div>

        {estudiantes.length > 0 ? (
          <ul className="lista">
            {estudiantes.map((estudiante) => (
              <li className="estudiante" key={estudiante.id}>
                <div className="estudiante__datos">
                  <span className="estudiante__inicial" aria-hidden="true">
                    {estudiante.nombre.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <h3>{estudiante.nombre}</h3>
                    <p>Nota: {estudiante.nota.toFixed(1)}</p>
                  </div>
                </div>
                <span
                  className={`estado ${estudiante.nota >= 3 ? 'estado--aprobado' : 'estado--pendiente'}`}
                >
                  {estudiante.nota >= 3 ? 'Aprobado' : 'No aprobado'}
                </span>
                <Boton
                  type="button"
                  variante="peligro"
                  onClick={() => eliminarEstudiante(estudiante.id)}
                  aria-label={`Eliminar a ${estudiante.nombre}`}
                >
                  Eliminar
                </Boton>
              </li>
            ))}
          </ul>
        ) : (
          <p className="lista__vacia">Todavía no hay estudiantes. Agrega el primero arriba.</p>
        )}
      </section>
    </main>
  );
}

export default App;
