## Migrations
1. Create migration file
```shell
    npx typeorm migration:create src/migrations/<name>
```
2. Add some fields
```
    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query(
        `ALTER TABLE "coffee" RENAME COLUMN "name" TO "title"`,
      );
    }
    
    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query(
        `ALTER TABLE "coffee" RENAME COLUMN "title" TO "name"`,
      );
    }
```
3. Run migrations
```shell
    npm run build #1
    npx typeorm migration:run -d dist/typeorm-cli.config #2 run migrations
    npx typeorm migration:revert -d dist/typeorm-cli.config #3 revert migrations
    npx typeorm migration:generate src/migrations/SchemaSync -d dist/typeorm-cli.config #4 generate migration  
```
