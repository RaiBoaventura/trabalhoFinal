CREATE TABLE Nf
(
    ID int NOT NULL PRIMARY KEY,
    DataDeEmissão date,
    Valor int NOT NULL,
    ID_do_Produto int NOT NULL,
    CONSTRAINT FK_NProdutos FOREIGN KEY (ID_do_Produto) REFERENCES Produto (ID_do_Produto)
)

FROM Produtos
SET Valor = Valor * 1.1;


SELECT p.tipo
