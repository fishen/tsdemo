<!-- TOC -->

- [Typescript基础](#typescript基础)
    - [Typescript简介](#typescript简介)
    - [主要特性](#主要特性)
    - [安装并使用](#安装并使用)
    - [基础类型(Types)](#基础类型types)
    - [变量声明](#变量声明)
    - [高级类型(Advanced Types)](#高级类型advanced-types)
        - [交叉类型（type1 & type2）](#交叉类型type1--type2)
        - [联合类型(type1 | type2)](#联合类型type1--type2)
    - [](#)
    - [函数声明](#函数声明)
    - [枚举声明](#枚举声明)
    - [类(Class)](#类class)
        - [类定义](#类定义)
        - [类示例](#类示例)
        - [访问修饰符](#访问修饰符)
        - [抽象类](#抽象类)
    - [接口(Interfaces)](#接口interfaces)
        - [接口定义](#接口定义)
        - [接口和抽象类和普通类比较](#接口和抽象类和普通类比较)
    - [泛型(Generics)](#泛型generics)
        - [泛型定义](#泛型定义)
        - [泛型用例](#泛型用例)
        - [类型推导](#类型推导)
        - [更安全的类型检查](#更安全的类型检查)
        - [泛型类](#泛型类)
        - [泛型方法](#泛型方法)
        - [泛型接口](#泛型接口)
        - [泛型约束](#泛型约束)
    - [装饰器(Decorators)](#装饰器decorators)
        - [类装饰器](#类装饰器)
        - [方法装饰器](#方法装饰器)
        - [访问器装饰器](#访问器装饰器)
        - [属性装饰器](#属性装饰器)
        - [参数装饰器](#参数装饰器)
        - [元数据(metadata)](#元数据metadata)
- [TS应用](#ts应用)
    - [服务优化——接口、泛型、继承、抽象类](#服务优化接口泛型继承抽象类)
    - [注册路由——枚举、装饰器](#注册路由枚举装饰器)
    - [依赖注入——装饰器、接口](#依赖注入装饰器接口)
    - [ORM——装饰器、继承](#orm装饰器继承)

<!-- /TOC -->
# Typescript基础
## Typescript简介
TypeScript是一种由微软开发的自由和开源的编程语言。它是JavaScript的一个超集，添加了可选的静态类型和基于类的面向对象编程。

2012年十月份，微软发布了首个公开版本的TypeScript，2013年6月19日，微软正式发布了正式版TypeScript 0.9，最新版本3.5。

TypeScript可以在任何浏览器、任何计算机和任何操作系统上运行，并且是开源的。
## 主要特性
* 类型批注编译时类型检查
* 类型推断
* 枚举
* 泛型
* 命名空间
* 接口
* 元组
* ES6中移植功能
* 类（以及抽象类）
* 装饰器
## 安装并使用
1. 安装TypeScript
```
>npm install -g typescript
>npm install -g ts-node
```
2. 创建文件hello.ts
```
//hello.ts
console.log("Hello World!");
```
3. 运行
```
>ts-node hello.ts
Hello World!
```
![](https://github.com/TypeStrong/ts-node/raw/master/screenshot.png)
## 基础类型(Types)
Boolean、String、Number、Array、Tuple、Enum、Undefined & Null、Void、Any、Never、Object

object表示非原始类型，也就是除number，string，boolean，symbol，null或undefined之外的类型。
## 变量声明
可以使用var、let、const多种方式声明，如果没有指定变量类型，则会自动从赋值推导类型；
```
// 格式
// let name: type = value;
// 以下两种声明方式相同
let str1 = 'hello world';
let str2: string = 'hello world';
// 先声明后赋值
let age: number;
age = 18;
// 如果赋不同类型的值，编译器则会报错
age = "18";// Error，不能将类型“"18"”分配给类型“number”
// 数组声明
// 以下两种声明方式相同；
let arr1: number[] = [1, 2, 3];
let arr2: Array<number> = [1, 2, 3];
// 任意类型声明
let anyType: any;
anyType = 1; // OK
anyType = true; // OK
```
## 高级类型(Advanced Types)
### 交叉类型（type1 & type2）
交叉类型是将多个类型合并为一个类型。 这让我们可以把现有的多种类型叠加到一起成为一种类型，它包含了所需的所有类型的特性。
```
let x: { a: string } & { b: number };
x.a;// OK
x.b;// OK
x.c;// Error 类型“{ a: string; } & { b: number; }”上不存在属性“c”。
```
### 联合类型(type1 | type2)
多种类型中的任意一中类型，联合类型与交叉类型很有关联，但是使用上却完全不同。
```
let v: string | number;
v = "hello";//OK
v = 123;//OK
v = null; //OK
v = undefined; //OK
v = true;// Error 不能将类型“true”分配给类型“string | number”
```
###
## 函数声明
函数声明需要指定参数类型和返回值类型，同样支持ES6中的参数默认值、解构、剩余参数等特性；
```
// 函数格式
// function funcName(arg1: type, arg2: type): returnType {
 
// }
// 示例
function add(num1: number, num2: number): number {
    return num1 + num2;
}
add(1, 2); // OK
add("1", "2"); // Error
// 如果函数没有返回值可以用void来表示
function log(message: string): void {
    console.log(message);
}
```
## 枚举声明
枚举用来定义一组相相同类型的集合变量，比如星期，颜色等。枚举声明采用关键字enum，可以在声明时指定部分或全部枚举值;

枚举值默认从0开始计数，枚举值会从前一个数字值依次累加；

如果将某一个枚举声明为非数字类型，那后面枚举值不能为空；

枚举变量名称推荐大写开头。
```
// 格式
// enum EnumName { Item1, Item2,..};
// 示例
enum HttpMethod { Get = 'get', Post = 'post', Put = 'put', Delete = 'delete' };
enum Colors { Red, Green, Blue };
console.log(Colors.Red, Colors.Green, Colors.Blue);// 0,1,2
enum Colors1 { Red = "red", Green = 3, Blue };
console.log(Colors.Red, Colors.Green, Colors.Blue);// red,3,4
Object.keys(Colors).forEach(key => console.log(key, Colors[key]));
// 3 Green
// 4 Blue
// Red red
// Green 3
// Blue 4
// 非数字枚举值
enum Colors2 { Red = "1", Green, Blue };// Error 枚举成员必须具有初始化表达式
enum Colors3 { Red = "1", Green = 1, Blue };// OK
enum Colors4 { Red = "1", Green = "2", Blue = "3" };// OK
```
## 类(Class)
### 类定义
从ECMAScript 2015，也就是ECMAScript 6开始，JavaScript程序员才能够使用基于类的面向对象的方式。
使用TypeScript，我们允许开发者现在就使用这些特性，并且编译后的JavaScript可以在所有主流浏览器和平台上运行，而不需要等到下个JavaScript版本。
### 类示例
我们声明一个 Student类。这个类有3个成员：一个叫做sno的属性，一个构造函数。
你会注意到，我们在引用任何一个类成员的时候都用了 this。 它表示我们访问的是类的成员。
```
class Student {
    sno: string
    constructor(sno: string) {
        this.language = languae;
    }
}
//简写形式
class Student {
    constructor(public sno: string) {
 
    }
}
```
### 访问修饰符
* public:公开的成员，TypeScript里，成员都默认为 public。
* private:当成员被标记成 private时，它就不能在声明它的类的外部访问。
* protected:protected修饰符与 private修饰符的行为很相似，但有一点不同， protected成员在派生类中仍然可以访问。
* readonly:你可以使用 readonly关键字将属性设置为只读的。 只读属性必须在声明时或构造函数里被初始化。
* static:静态成员，只能通过类访问，无法通过实例访问。
### 抽象类
抽象类做为其它派生类的基类使用。 它们一般不会直接被实例化。 不同于接口，抽象类可以包含成员的实现细节。abstract关键字是用于定义抽象类和在抽象类内部定义抽象方法。
```
abstract class Person {
    firstName: string;
    lastName: string;
    //getter
    get fullName(): string {
        return this.firstName + ' ' + this.lastName;
    }
    //setter
    set fullName(value: string) {
        if (!value) return;
        const [firstName, lastName] = value.trim().split(' ');
        firstName && (this.firstName = firstName);
        lastName && (this.lastName = lastName);
    }
    // absctract member
    abstract language: string;
    // private 只能在当前类内部访问
    private privateVar: string;
    // protected 可以在当前类和派生类中访问
    protected protectedVar: string;
    // public 公开的成员，默认修饰符
    public publicVar: string;
}
class Student extends Person {
    language: string;
    constructor(public sno: string, public readonly id: Symbol) {
        super();
    }
}
 
const stu = new Student('1234567890', Symbol());
stu.protectedVar; // Error 属性“protectedVar”受保护，只能在类“Person”及其子类中访问。
stu.sno; // OK
stu.id; // OK
stu.id = Symbol(); // Error 无法分配到“id”，因为它是常数或只读属性。
```
## 接口(Interfaces)
### 接口定义
TypeScript的核心原则之一是对值所具有的结构进行类型检查。 它有时被称做“鸭式辨型法”或“结构性子类型化”。
在TypeScript里，接口的作用就是为这些类型命名和为你的代码或第三方代码定义契约。

接口仅定义签名，不包含方法实现，接口名称必须是有效的标识符名称。按照约定，接口名称以大写字母I开头。

可使用 interface 关键字定义接口。 如以下示例所示。
```
// 原生js，不支持类型推断
function excute(obj) {
    obj.do();
    console.log(obj.name);
}
 
// ts化
function excute1(obj: { name: string, do: () => void }): void {
    obj.do();
    console.log(obj.name);
}
 
// 接口提取
interface IDo {
    name: string,
    do(): void
}
function excute2(obj: IDo): void {
    obj.do();
    console.log(obj.name);
}
// 接口实现
class Do implements IDo {
    name: string;
    do(): void {
        throw new Error("Method not implemented.");
    }
}
excute2(new Do());
```
### 接口和抽象类和普通类比较
类型 |接口|抽象类|普通类
---|:--:|:---:|---
继承接口|√|√|√
继承抽样类|×|√|√
可以被继承多个|√|×|×
方法定义|√|√|√
方法实现|×|√|√
实例化|×|×|√
可包含修饰符|×|√|√
## 泛型(Generics)
### 泛型定义
>泛型程序设计是程序设计语言的一种风格或范式。泛型允许程序员在强类型程序设计语言中编写代码时使用一些以后才指定的类型，在实例化时作为参数指明这些类型。——维基百科

泛型是在程序设计语言中编写代码时定义一些**可变部分**，那些部分在使用前必须作出指明。将**类型参数化**以达到**代码复用**提高软件开发工作效率的一种数据类型。使用泛型类型可以最大限度地重用代码、保护类型安全性以及提高性能。
### 泛型用例
一般情况下同一个后端服务遵循相同的API设计规范，比如下面这个返回数据格式：
```
{
    code:number;
    data:any;
    message:string;
}
```
在JS开发过程中，我们可以直接动态创建任意类型的对象，但是这样做缺乏安全性和可扩展性，很有可能拼错属性名称，或者重复定义默认值。
```
const result={
    code:0,
    data:{...}
    message:'success'
}
```
我们可以采用更好的解决方案，用类和对象来封装这个操作：
```
//model.ts
class UserViewModel{
    constructor(data:User, code?:number, message?:string){
        this.code=code||0;
        this.message=messsage||'success';
        this.data=data;
    }
    public data:User;
    public code:number;
    public message:string;
}

//api
const result=new UserViewModel({...});
```
通过使用类型封装解决了上面名称可能会拼写错误的问题，可另一个重复声明默认值的问题以然存在。我们可以通过继承来解决这个问题。
```
//model.ts
class ViewModel{
    public code:number;
    public message:string;
    constructor(code?:number,message?:string){
        this.code=code||0;
        this.message=messsage||'success';
    }
}

class UserViewModel extends ViewModel{
    public data:User;
    constructor(data:User,code?:number,message?:string){
        super(code,message);
        this.data=data;
    }
}

class OtherViewModel extends ViewModel{
    public data:Other;
    constructor(data:Other,code?:number,message?:string){
        super(code,message);
        this.data=data;
    }
}
//api
const result=new UserViewModel({...});
//other api
const result=new OtherViewModel({...});
```
这样就可以解决默认值的问题，而且代码更容易扩展，只需要在每个API当中重复上面的操作，定义模型（class），然后实例化这个类型(new Type(...))得到想要的对象。只是重复进行看起来差不多一样的操作，依然显得笨拙，费时费力，那有没有什么好一点的解决方案呢？答案是有的，比如我们可以将data声明提到ViewModel当中，只是这个时候，我们只能将它定义为any类型，这样在使用的时候，就会省去重复声明模型的过程。
```
class ViewModel{
    public code:number;
    public data:any;
    public message:string;
    constructor(data:any,code?:number,message?:string){
        this.code=code||0;
        this.message=messsage||'success';
        this.data=data;
    }
}
//api
const result=new ViewModel({...});
//other api
const result=new ViewModel({...});
```
看起来很不错，省去了很多工作，但是通过使用我们会发现，这里的模型实例中data属性，失去了类型推断。比如下面的示例当中，当我们想使用`String`类型的属性或者方式，会发现编辑器没有给出任何提示，这太傻了，它明明是字符串类型的……或许可以接受这一点小瑕疵，毕竟我们已经完美的解决上面遇到的所有问题，但是也我们可以使用更好的解决方案：泛型。
```
const str="hello world";
const result=new ViewResult(str);
result.data.???
```
通过前面代码示例当中的`UserVIewModel`和`OtherViewModel`对比，我们发现，他们之间只有data的类型不一致，如果能有什么方法把这个类型提取出来，由外部传入，然后把用到的地方全部替换就好了。我们理想当中的类型应该是这样：
```
//<TYPE>是我们提取出来的类型变量，假设可以由外部传入
class ViewModel{
    public code:number;
    public data:<TYPE>;
    public message:string;
    constructor(data:<TYPE>,code?:number,message?:string){
        this.code=code||0;
        this.message=messsage||'success';
        this.data=data;
    }
}
//理想中的调用方式
new ViewModel<User>();
new ViewModel<Other>();
```
泛型所做的工作就是这样的，将变化的类型变量提出来，然后在用的时候用外部传入的类型进行替换。通过一对尖括号来定义类型变量，变量名称可以是任意合法的变量名称，一般以单个大写字母表示，而且，可以同时有多个泛型声明。比如\<T>、\<U>和\<V,Y> 等。我们用泛型的方式来重写上面的实例。
```
//model.ts
class ViewModel<T>{
    public code:number;
    public data:<T>;
    public message:string;
    constructor(data:<T>,code?:number,message?:string){
        this.code=code||0;
        this.message=message||'success';
        this.data=data;
    }
}

//api.ts
const result=new ViewModel<User>(user);
//other.ts
const result=new OtherResult<Other>(other);
```
> 泛型可以在使用时可以不用指定类型而进行类型自动推断, 所以在上面的示例中可以还可以简写成`new ViewModel(user);`
### 类型推导
```
const array = [];
array.push('hello');
array[0].toUpperCase();//数组元素类型为any,无法使用类型推导
 
const stringArr: Array<string> = [];
stringArr.push("hello"); //ok
stringArr[0].toUpperCase();//数组元素类型为string，可以使用类型推导
```
### 更安全的类型检查
```
const stringArr: Array<string> = [];
stringArr.push("hello"); //ok
stringArr.push(0); //error 类型“0”的参数不能赋给类型“string”的参数。
```
### 泛型类
```
export class Student {
    public id: string;
    public name: string;
    public age: number;
}
// 传统对象声明
export class GetStudentResponse {
    public message: string;
    public code: number;
    public data: Student;
}
// 每个对象都要重复声明
export class GetStudentListResponse {
    public message: string;
    public code: number;
    public data: Array<Student>;
}
// 创建对象
const studentResponse = new GetStudentResponse();
const studentListResponse = new GetStudentListResponse();
// 泛型封装
export class HTTPResponse<T>{
    public message: string;
    public code: number;
    public data: T;
}
//创建对象
const studentResponse = new HTTPResponse<Student>();
const studentListResponse = new HTTPResponse<Array<Student>>();
```
### 泛型方法
```
// 普通方法
function request(options): any {
    const { url, method, params } = options;
    //send http request
    const data = {};
    return data;
}
 
function getStudent(): Student {
    const data = request({ url: '' });
    const result = data as Student;
    return result;
}
 
function getStudentList(): Array<Student> {
    const data = request({ url: '' });
    const result = data as Array<Student>;
    return result;
}
 
const student = getStudent();
const students = getStudentList();
// 泛型方法
function <T>(options): T {
    const { url, method, params } = options;
    return request(options) as T;
}
 
const student = get<Student>({ url: '' });
const students = get<Array<Student>>({ url: '' });
```
### 泛型接口
```
// 普通接口
export interface IStudentService {
    add(model: Student): Student;
    delete(id: string): void;
    update(model: Student): void;
    get(id: string): Student;
}
 
export class StudentService implements IStudentService {
    add(model: Student): Student {
        throw new Error("Method not implemented.");
    }
    delete(id: string): void {
        throw new Error("Method not implemented.");
    }
    update(model: Student): void {
        throw new Error("Method not implemented.");
    }
    get(id: string): Student {
        throw new Error("Method not implemented.");
    }
}
// 泛型接口
export interface IService<T> {
    add(model: T): T;
    delete(id: string): void;
    update(model: T): void;
    get(id: string): T;
}
 
export class StudentService implements IService<Student> {
    add(model: Student): Student {
        throw new Error("Method not implemented.");
    }
    delete(id: string): void {
        throw new Error("Method not implemented.");
    }
    update(model: Student): void {
        throw new Error("Method not implemented.");
    }
    get(id: string): Student {
        throw new Error("Method not implemented.");
    }
}
```
### 泛型约束
泛型提供了类型模板的功能，可有时候我们希望泛型类型能更加具体化以提高代码的安全性。比如我们可能会在方法里面实例化某一个类型。如果直接初始化就会报错，因为编译器无法保证类型T是可以实例化的，它可能是null也可能是一个常量。
```
function func<T>(type:T){
    //...
    // error:Cannot use 'new' with an expression whose type lacks a call 
    // or construct signature.ts(2351)
    const instance=new type(); 
    //...
}
```
可以使泛型参数更夹具体话，比如在上面这个实例中，我们可以要求类型T必须是可实例化的。
```
function func<T extends new (...args:any[])=>any>(type:T){}
```
再看一个打印消息的例子：
```
function log<T extends { message: string }>(param: T) {
    console.log(param.message);
}

log({ message: 'hello' }); //ok
log(new Error()); //ok
// error: Argument of type '3' is not assignable to parameter of type '{ message: string; }'.
log(3); 
```
## 装饰器(Decorators)
装饰器是一种特殊类型的声明，它能够被附加到类声明，方法，访问符，属性或参数上。 装饰器使用@expression这种形式，expression求值后必须为一个**函数**，它会在运行时被调用，被装饰的声明信息做为参数传入。
>在C#中类似的功能称作特性，在Java和Python中称之为注解，值得一提的是，Python里面的注解就是借鉴自TypeScript中的装饰器;

若要启用实验性的装饰器特性，你必须在命令行或tsconfig.json里启用experimentalDecorators编译器选项
命令行:
```
tsc --target ES5 --experimentalDecorators
```
tsconfig.json:
```
{
    "compilerOptions": {
        "target": "ES5",
        "experimentalDecorators": true
    }
}
```
### 类装饰器
顾名思义，类装饰器用于装饰类，在类声明之前被声明。 可以用来监视，修改或替换类定义。类装饰器表达式会在运行时当作函数被调用，类的构造函数作为其唯一的参数。
```
/**
 * @param constructor 类的构造函数
 */
function classDecorator(constructor: any) {
    constructor.prototype.value = 100;
}

export class RawDemo {
    value: number;
}

@classDecorator
export class Demo {
    value: number;
}

console.log(new RawDemo().value); //undefined
console.log(new Demo().value); //100
```
如果类装饰器返回一个函数值，它将会替代默认的构造函数。
```
function classDecorator(constructor: any): any {
    return function () {
        console.log('new constructor excuting');
    }
}

@classDecorator
export class Demo {
    constructor() {
        console.log('raw constructor excuting');
    }
}

new Demo(); //new constructor excuting
```
### 方法装饰器
方法装饰器声明在一个方法的声明之前。 它会被应用到方法的属性描述符上，可以用来监视，修改或者替换方法定义。
方法装饰器表达式会在运行时当作函数被调用，传入下列3个参数：
1. 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
2. 成员的名字。
3. 成员的属性描述符。
```
/**
 * @param target 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
 * @param method 成员的名称。
 * @param descriptor 成员的属性描述符。
 */
function methodDecorator(target: any, method: string, descriptor: PropertyDescriptor): any {
    target.value = 100;
    // 不能通过直接修改原型对应的方法来重写当前方法
    // target[method] = function () {
    //     console.log(`Hi, I'm ${method}`);
    // }
    descriptor.value = function () {
        console.log(`Hi, I'm ${method}`);
    }
}
export class Demo {
    value: number;
    @methodDecorator
    say() {
        console.log('hello');
    }
}
const demo = new Demo();
console.log(demo.value); //100
console.log(demo.say()); //Hi, I'm say
```
### 访问器装饰器
访问器装饰器声明在一个访问器的声明之前。 访问器装饰器应用于访问器的属性描述符并且可以用来监视，修改或替换一个访问器的定义。
>注意:TypeScript不允许同时装饰一个成员的get和set访问器。取而代之的是，一个成员的所有装饰的必须应用在文档顺序的第一个访问器上。这是因为，在装饰器应用于一个属性描述符时，它联合了get和set访问器，而不是分开声明的。

访问器装饰器表达式会在运行时当作函数被调用，传入下列3个参数：
1. 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
2. 成员的名字。
3. 成员的属性描述符。
### 属性装饰器
属性装饰器声明在一个属性声明之前。
属性装饰器表达式会在运行时当作函数被调用，传入下列2个参数：
1. 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
2. 成员的名字。
### 参数装饰器
参数装饰器声明在一个参数声明之前。 参数装饰器应用于类构造函数或方法声明。
参数：
1. 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
2. 成员的名字。
3. 参数在函数参数列表中的索引。
> 特别需要说明的是，第二个参数为当前所在方法名称，并不是参数名称。
### 元数据(metadata)
一些例子使用了reflect-metadata库来支持实验性的metadata API。 这个库还不是ECMAScript (JavaScript)标准的一部分。 然而，当装饰器被ECMAScript官方标准采纳后，这些扩展也将被推荐给ECMAScript以采纳。

TypeScript支持为带有装饰器的声明生成元数据。 你需要在命令行或tsconfig.json里启用emitDecoratorMetadata编译器选项。
Command Line:
```
tsc --target ES5 --experimentalDecorators --emitDecoratorMetadata
```
tsconfig.json:
```
{
    "compilerOptions": {
        "target": "ES5",
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true
    }
}
```
目前可以获取的元数据有三种类型
* design:paramtypes：获取参数类型
* design:type：获取属性或访问器类型
* design:returntype：获取方法返回类型
# TS应用
## 服务优化——接口、泛型、继承、抽象类
## 注册路由——枚举、装饰器
## 依赖注入——装饰器、接口
## ORM——装饰器、继承
