export const indexView = (req, res) => {
    const data = { 
        title: "George Kelly Career Repertory Grid", 
    };
    res.render("index", {data});
};

export const chineseView = (req, res) => {
    const data = { 
        title: "George Kelly Career Repertory Grid", 
    };
    res.render("index-cn", {data});
}