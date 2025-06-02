 {
    veiculo: "Frota A - Placa ABC1234",
    dataHora: "2025-06-01 14:32",
    localizacao: "Av. Brasil, 123 - São Paulo/SP",
    tipoEvento: "Parada prolongada"
  },
  {
    veiculo: "Frota B - Placa DEF5678",
    dataHora: "2025-06-01 14:35",
    localizacao: "Rua das Flores, 456 - Campinas/SP",
    tipoEvento: "Desvio de rota"
  }
];

function carregarEventos() {
  const tabela = document.querySelector("#tabela-eventos tbody");
  eventosMock.forEach(evento => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${evento.veiculo}</td>
      <td>${evento.dataHora}</td>
      <td>${evento.localizacao}</td>
      <td>${evento.tipoEvento}</td>
    `;
    tabela.appendChild(linha);
  });
}

document.addEventListener("DOMContentLoaded", carregarEventos);
