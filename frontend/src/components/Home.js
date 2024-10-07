import React, { useEffect, useState } from 'react';
import '../styles/home.css';

export default function Home() {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [credit, setCredit] = useState(0);
    const [debit, setDebit] = useState(0);
    const [credentials, setCredentials] = useState({ amount: 0, type: "", description: "" });

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log("token from storage - Home.js"+ token);
        if (!token) {
            alert("You need to login first");
            window.location.href = '/login';
            return;
        }

        const fetchBalance = async () => {
            try {
                const balanceResponse = await fetch('http://localhost:4000/api/account/getBalance', {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "token": token // Use token as header name
                    }
                });
                const response = await balanceResponse.json();
                console.log(response.Balance);
                setBalance(response.Balance);
            } catch (error) {
                console.log(error.message);
            }
        };

        const fetchTransactions = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/account/getTransactions', {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "token": token // Use token as header name
                    }
                });
                const data = await response.json();
                if (Array.isArray(data)) { // Ensure the data is an array
                    setTransactions(data);
                    let totalCredit = 0;
                    let totalDebit = 0;

                    data.forEach(transaction => {
                        if (transaction.type === 'Credit')
                            totalCredit += transaction.amount;
                        else if (transaction.type === 'Debit')
                            totalDebit += transaction.amount;
                    });

                    console.log({ totalCredit, totalDebit });
                    setCredit(totalCredit);
                    setDebit(totalDebit);
                } else {
                    console.error("Expected an array but got:", data);
                }
            } catch (error) {
                console.log(error.message);
            }
        };

        fetchBalance();
        fetchTransactions();
    }, []);

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:4000/api/account/transaction', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "token": token // Use token as header name
                },
                body: JSON.stringify({
                    amount: parseFloat(credentials.amount),
                    type: credentials.type,
                    description: credentials.description
                })
            });

            const data = await response.json();
            console.log(data);

            // Update the transactions and balance after submitting the form
            if (data) {
                setTransactions([...transactions, data]);
                if (data.type === 'Credit') {
                    setBalance(balance + data.amount);
                    setCredit(credit + data.amount);
                } else if (data.type === 'Debit') {
                    setBalance(balance - data.amount);
                    setDebit(debit + data.amount);
                }
            }

        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div className='container mx-3 my-3 home'>
            <h3 className='balance'>Your Balance : Rs. {balance} </h3>

            <div className='balanceCard'>
                <div className="card text-center mb-3 my-2 mx-2 " style={{ width: '15rem' }}>
                    <div className="card-body">
                        <h5 className="card-title">INCOME</h5>
                        <h6 className="card-text income">Rs. {credit}</h6>
                    </div>
                </div>
                <div className="card text-center mb-3 my-2 mx-2" style={{ width: '15rem' }}>
                    <div className="card-body">
                        <h5 className="card-title">EXPENSE</h5>
                        <h6 className="card-text expense">Rs. {debit}</h6>
                    </div>
                </div>
            </div>

            <h3>History</h3>

            <ul className="list-group">
                {transactions.length === 0 ? (
                    <p>No Transactions yet!</p>
                ) : (
                    transactions.map((element, index) => (
                        <li key={index} className="list-group-item" id ={element.type === 'Credit'?'income':'expense'}>
                            <span>{element.type === 'Credit' ? 'Cash' : 'Bag'}</span>
                            <span>{element.type === 'Credit' ? `+Rs. ${element.amount}` : `-Rs. ${element.amount}`}</span>
                        </li>
                    ))
                )}
            </ul>

            <h3 className='my-3'>Add new transactions</h3>
            <div className='form'>
                <form className="my-3" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input type="text" className="form-control my-2" id="description" name='description' placeholder="Enter Description" onChange={onChange} />
                    </div>
                    <div className="form-group">
                        <input type="text" className="form-control my-2" id="type" name='type' placeholder="Credit/Debit" onChange={onChange} />
                    </div>
                    <div className="form-group">
                        <input type="number" className="form-control my-2" id="amount" name='amount' placeholder="Enter Amount" onChange={onChange} />
                    </div>

                    <button type="submit" className="btn btn-primary my-2">Submit</button>
                </form>
            </div>
        </div>
    )
}
