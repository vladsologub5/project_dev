import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DataSource,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";

@Entity({ name: "public.clients" })
export class Client {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  email!: string;

  @Column()
  password!: number;

  @OneToMany(() => BasketItem, (basketItem) => basketItem.client)
  basketItems!: BasketItem[];
}

@Entity({ name: "public.products" })
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  price!: number;

  @OneToMany(() => BasketItem, (basketItem) => basketItem.product)
  basketItems!: BasketItem[];
}

@Entity({ name: "public.basket" })
export class BasketItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "client_id" })
  clientId!: number;

  @ManyToOne(() => Client, (client) => client.basketItems)
  @JoinColumn({ name: "client_id" })
  client!: Client;

  @Column({ name: "product_id" })
  productId!: number;

  @ManyToOne(() => Product, (product) => product.basketItems)
  @JoinColumn({ name: "product_id" })
  product!: Product;
}

const connection = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "customuser",
  password: "custompassword",
  database: "customdb",
  synchronize: false,
  logging: true,
  entities: [Client, BasketItem, Product],
});

async function main() {
  await connection.initialize();
  const clients = await connection
    .createQueryBuilder(Client, "c")
    .innerJoinAndSelect("c.basketItems", "bi")
    .innerJoinAndSelect("bi.product", "p")
    .getMany();
  console.log(clients[0].basketItems[0].product.title);
}

main();
