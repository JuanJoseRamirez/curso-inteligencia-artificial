/** Adaptations of the lecture notes §1.4.5, §2.3.4–2.3.6 and AIMA §§2.4, 3.4. */
export const limitedRecursiveCode = `función BUSQUEDA-LIMITADA-RECURSIVA(problema, límite):
  raíz ← nodo(problema.inicial, camino=[problema.inicial], costo=0)
  devolver VISITAR(problema, raíz, límite)

función VISITAR(problema, nodo, restante):
  si problema.ES-META(nodo.estado): devolver nodo.camino
  acciones ← filtrar problema.ACCIONES(nodo.estado), conservando
             las que tienen su resultado fuera de nodo.camino
  si acciones está vacía: devolver FRACASO
  si restante = 0: devolver CORTE
  huboCorte ← falso
  para cada acción en acciones, en orden inverso de inserción en la pila:
    hijo ← CREAR-HIJO(problema, nodo, acción)
    resultado ← VISITAR(problema, hijo, restante - 1)
    si resultado es un camino: devolver resultado
    si resultado es CORTE: huboCorte ← verdadero
  fin para
  si huboCorte: devolver CORTE
  devolver FRACASO`;

export const bidirectionalCode = `función BIDIRECCIONAL-UNITARIA(inicio, meta, SUCESORES, PREDECESORES):
  si inicio = meta: devolver [inicio]
  F ← [inicio]; B ← [meta]
  RF ← {inicio: (enlace=NULO, distancia=0)}
  RB ← {meta: (enlace=NULO, distancia=0)}
  mientras F y B no estén vacías:
    F, encuentro ← EXPANDIR-NIVEL(F, RF, RB, SUCESORES)
    si encuentro no es NULO: devolver UNIR(RF, RB, encuentro)
    si F está vacía: devolver FRACASO
    B, encuentro ← EXPANDIR-NIVEL(B, RB, RF, PREDECESORES)
    si encuentro no es NULO: devolver UNIR(RF, RB, encuentro)
  fin mientras
  devolver FRACASO

función EXPANDIR-NIVEL(frente, propios, otros, vecinos):
  siguiente ← []; encuentro ← NULO; longitud ← infinito
  para cada estado en frente:
    para cada vecino en vecinos(estado), en el orden dado:
      si vecino no está en propios:
        propios[vecino] ← (enlace=estado,
                          distancia=propios[estado].distancia + 1)
        añadir vecino al final de siguiente
      si vecino está en otros:
        total ← propios[vecino].distancia + otros[vecino].distancia
        si total < longitud:
          encuentro ← vecino; longitud ← total
    fin para
  fin para
  devolver siguiente, encuentro

función UNIR(RF, RB, encuentro):
  izquierda ← invertir(SEGUIR-ENLACES(RF, encuentro))
  derecha ← SEGUIR-ENLACES(RB, encuentro)
  quitar el primer estado de derecha
  devolver concatenar(izquierda, derecha)

función SEGUIR-ENLACES(registro, estado):
  camino ← []
  mientras estado no es NULO:
    añadir estado al final de camino
    estado ← registro[estado].enlace
  fin mientras
  devolver camino`;

export function agentPseudocode(model: boolean): string {
  return model ? `persistente memoria ← {A: desconocida, B: desconocida}
// Se inicializa una sola vez, antes de la primera percepción.
función AGENTE-CON-MODELO(ubicación, estadoActual):
  memoria[ubicación] ← estadoActual
  si estadoActual = sucia: devolver LIMPIAR
  si memoria[A] = limpia y memoria[B] = limpia: devolver ESPERAR
  si ubicación = A: devolver MOVER-A-B
  devolver MOVER-A-A` : `función AGENTE-REFLEJO(ubicación, estadoActual):
  si estadoActual = sucia: devolver LIMPIAR
  si ubicación = A: devolver MOVER-A-B
  devolver MOVER-A-A`;
}
