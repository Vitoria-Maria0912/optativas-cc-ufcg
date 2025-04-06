export const defaultPlanning = {
    planningId: 0,
    periods: {
        1: ["P1", "LP1", "FMCC1", "IC", "Direito"],
        2: ["P2", "LP2", "FMCC2", "C1", "Economia"],
        3: ["C2", "EDA", "LEDA", "Lógica", "Linear"],
        4: ["TC", "OAC", "BD1", "PLP", "Grafos", "Prob"],
        5: ["IA", "SO", "ES", "PSoft", "Redes", "Estatística"],
        6: ["AS", "ATAL", "Concorrente", "Optativa" , "Optativa"],
        7: ["Compila", "Metodologia", "Optativa", "Optativa", "Optativa"],
        8: ["P1", "Português", "Optativa", "Optativa", "Optativa"],
        9: ["P2", "TCC", "Optativa", "Optativa", "Optativa"],
    }
}

export const defaultSelect = [
    {
        name: "Planejamento padrão",
        key: '0',
        label: (
            <a rel="noopener noreferrer" href="#">
                Planejamento padrão
            </a>
        ),
    }
];