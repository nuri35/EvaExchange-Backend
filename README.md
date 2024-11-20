<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
 

## Project Overview:
 
 - This project implements a trading platform backend where users can manage shares and portfolios and perform buy/sell trades. The platform adheres to realistic stock exchange principles, ensuring accurate and fair calculations for share prices and trade operations.

### **Key Features**

- **Share Management**  
  - Users can register new shares with unique symbols (3 uppercase characters).  
  - Share prices are updated hourly based on recent trade data (average of buy/sell prices in the last hour).  

- **Portfolio Management**  
  - Users must have a registered portfolio to perform trades.  
  - Portfolios track the total value of shares based on their latest prices.  

- **Trade Operations**  
  - Users can perform **BUY** and **SELL** operations.  
    - **BUY:**  
      - The latest share price is used for the trade.  
      - Only registered shares and portfolios are allowed.  
    - **SELL:**  
      - The user must have sufficient shares in their portfolio.  
      - The latest share price is used for the trade.  
  - The system validates all conditions before processing trades.  

- **Real-Time Price Updates**  
  - Share prices are recalculated hourly based on:  
    - Average of **BUY** prices.  
    - Average of **SELL** prices.  
    - Default to the existing price if no trades occurred within the last hour.  


### **Usage**

- **Trade Endpoint**  
  - Allows users to buy/sell shares within their portfolio.  

- **Share Update Endpoint**  
  -  Updates share prices hourly or manually based on trade history.  

- **Validation**  
  - Ensures all operations align with stock exchange rules, preventing invalid trades.  

- **Extendability**  
  - This platform can be extended further for real-world trading scenarios or as a foundation for stock market simulations.  



## Features with TypeORM

### Custom Repositories
Custom repositories were utilized to handle database operations. These repositories allow for clean and reusable code, ensuring that all database interactions are centralized and follow best practices.

### Transactions
Transactions were implemented to manage operations atomically. This ensures that all related database operations are executed successfully or none at all, maintaining data consistency and reliability.

### Entity Listeners and Subscribers
Entity listeners and subscribers were employed to define custom behaviors that automatically execute during database operations. These features enhance the flexibility and automation of the application by enabling hooks for lifecycle events like `insert`, `update`, and `delete`.




## SOLID Principles Applied in the Code

This implementation of the `AbstractCalculator` and its concrete classes, such as `AverageCalculator` and `TotalCalculator`, demonstrates the application of various SOLID principles. Here's how each principle is addressed:

### 1. **Single Responsibility Principle (SRP)**
- Each class has a single responsibility:
  - `AbstractCalculator` provides a reusable base structure for calculation logic.
  - `AverageCalculator` is responsible for calculating the average of trade data.
  - `TotalCalculator` determines whether a given quantity is within the available quantity after trades.
- This separation ensures that each class has only one reason to change.

### 2. **Open-Closed Principle (OCP)**
- The `AbstractCalculator` class is open for extension but closed for modification:
  - New calculation logic can be added by extending the `AbstractCalculator` class without modifying the base class.
  - For example, `AverageCalculator` and `TotalCalculator` extend the base functionality without altering its implementation.

### 3. **Liskov Substitution Principle (LSP)**
- Concrete classes (`AverageCalculator`, `TotalCalculator`) can be used interchangeably wherever `AbstractCalculator` is expected.
- This ensures that substituting a subclass does not alter the correctness of the application, as all subclasses adhere to the contract defined by `AbstractCalculator`.

### 4. **Interface Segregation Principle (ISP)**
- While no explicit interfaces are defined here, the `AbstractCalculator` defines a clear contract (`calculate` method) that all subclasses must implement.
- This approach ensures that subclasses implement only the methods they need, adhering to the principle in spirit.

### 5. **Dependency Inversion Principle (DIP)**
- High-level modules (e.g., services using these calculators) depend on the abstraction (`AbstractCalculator`) rather than concrete implementations (`AverageCalculator`, `TotalCalculator`).
- This is achieved by designing the `AbstractCalculator` as an abstract class and injecting specific implementations (`@Injectable()` decorators in the concrete classes) where needed.

---

## Benefits of the Design

- **Reusability:** The abstract base class allows for the creation of multiple calculation types while reusing the common logic.
- **Maintainability:** Each class is self-contained, making it easier to debug, test, and extend.
- **Extensibility:** New calculators can be added by extending the `AbstractCalculator` without impacting existing classes.

---

By following SOLID principles, this implementation promotes clean, scalable, and maintainable code, suitable for handling complex trade operations such as averages and total quantities efficiently.


 


## Ways to Run the Application

Follow these steps to set up and run the application:

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-folder>
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory and add the following environment variables:

```bash
DB_NAME=postgres
SYNCHRONIZE=true
DB_HOST=localhost
DB_PORT=5432
DB_PASS=postgres
DB_USER=postgres
DB_TYPE=postgres
COOKIE_KEY=usYvcPuTTZnafZKrEDIi
MIGRATIONS_RUN=true
LOGGING=true
UPDATE_INTERVAL=3600
```

### 3. Seed the Database

Run the following command to seed the database with initial data:

```bash
npm run db:seed
```

### 4. Run the Application

Run the following command to start the application:

```bash
npm run start:dev
```




## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
 

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.



<!-- CONTACT -->
## Contact

Nurettin Şen - [ ](gmail.com) - nurie487@gmail.com
 