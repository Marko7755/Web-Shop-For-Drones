SELECT SUM(satikvar) FROM kvar
WHERE sifKvar = 36 OR sifKvar = 22


SELECT CONSTRAINT_NAME, TABLE_NAME 
FROM information_schema.TABLE_CONSTRAINTS 
WHERE CONSTRAINT_SCHEMA = 'dronax' 
AND CONSTRAINT_NAME = 'fk_ShoppingCart_Drone1';



ALTER TABLE `ShoppingCart` DROP FOREIGN KEY `fk_ShoppingCart_Drone1`;
ALTER TABLE `ShoppingCart` DROP FOREIGN KEY `fk_ShoppingCart_User1`;

DROP TABLE shoppingcart


INSERT INTO manufacturer(NAME, country)  VALUES('proba', 'test')

SELECT * FROM manufacturer
WHERE idManufacturer = "1" OR NAME = 'probap'




DELETE FROM drone WHERE idDrone = 15 OR idDrone = 16


DELETE FROM manufacturer WHERE idmanufacturer = 3 OR idmanufacturer = 4 OR idmanufacturer = 5


UPDATE manufacturer
SET NAME = 'proba2' WHERE idmanufacturer = 2


SELECT * FROM manufacturer
WHERE idManufacturer = "proba" OR NAME = 'proba';



UPDATE manufacturer
SET NAME = 'probicaa',
    country = 'Hungary'
WHERE idManufacturer = 6;

DELETE FROM manufacturer
WHERE idManufacturer = 1;


SELECT * FROM drone 
WHERE idDrone = 12;


SELECT * FROM drone WHERE idDrone = 'droncek' OR NAME = 'droncek'


DELETE FROM drone
WHERE idDrone = 18

UPDATE discount 
SET amount = 25,
startDate = '2025-03-12',
endDate = '2025-03-15'
WHERE idDiscount = 1;



SELECT d.idDrone, d.name AS droneName, d.price, m.name AS manufacturerName
                FROM Drone d
                JOIN Manufacturer m ON d.idManufacturer = m.idManufacturer
                
                
              SELECT d.idDrone, d.name AS droneName, d.price, m.name AS manufacturerName, di.imageUrl
                FROM Drone d
                JOIN Manufacturer m ON d.idManufacturer = m.idManufacturer
                LEFT JOIN Drone_Image di ON d.idDrone = di.idDrone
                GROUP BY d.idDrone, droneName,  d.price, manufacturerName, di.imageUrl


SELECT d.idDrone, d.name, m.name AS manuName, d.price, dI.imageUrl
FROM drone d JOIN Drone_Image dI 
ON d.idDrone = dI.idDrone JOIN Manufacturer m
ON d.idManufacturer = m.idManufacturer;


SELECT d.idDrone, d.name AS droneName, m.name AS manufacturerName, d.price, 
                   MIN(dI.imageUrl) AS imageUrl
            FROM drone d 
            JOIN Manufacturer m ON d.idManufacturer = m.idManufacturer
            LEFT JOIN Drone_Image dI ON d.idDrone = dI.idDrone
            GROUP BY d.idDrone, droneName, manufacturerName, d.price;
            
            
DELETE FROM drone WHERE idDrone NOT IN (12, 17);


SELECT sc.idDrone, d.name, d.price, d.imageUrl, sc.quantity 
FROM Shopping_Cart sc JOIN Drone d ON sc.idDrone = d.idDrone 
WHERE sc.idUser = 3       

SELECT *
FROM Shopping_cart sc JOIN drone d 
ON sc.idDrone = d.idDrone JOIN Drone_Image di
ON d.idDrone = di.idDrone
WHERE d.idDrone = 12
LIMIT 1;     

SELECT sc.idUser, sc.idDrone, sc.quantity, d.name, d.about, d.manufacturingDate, d.price, d.isArchived, di.idImage, di.idDrone, di.imageUrl
FROM Shopping_cart sc JOIN drone d ON sc.idDrone = d.idDrone LEFT JOIN Drone_Image di ON d.idDrone = di.idDrone 
WHERE sc.idUser = '3'
GROUP BY sc.idUser, sc.idDrone, sc.quantity, d.name, d.about, d.manufacturingDate, d.price, d.isArchived, di.idImage, di.idDrone, di.imageUrl;

SELECT 
    sc.idUser, 
    sc.idDrone, 
SELECT 	`idDrone`, 
	`idDiscount`, 
	`lastDiscountDate`, 
	`isActive`
	 
	FROM 
	`dronax`.`drone_discount` 
	LIMIT 0, 1000;

    sc.quantity, 
    d.name, 
    d.about, 
    d.manufacturingDate, 
    d.price, 
    MIN(di.imageUrl) AS imageUrl
FROM Shopping_Cart sc
JOIN Drone d ON sc.idDrone = d.idDrone
LEFT JOIN Drone_Image di ON d.idDrone = di.idDrone
WHERE sc.idUser = 3
GROUP BY sc.idUser, sc.idDrone, sc.quantity, d.name, d.about, d.manufacturingDate, d.price;



SELECT sc.idUser, sc.idDrone, sc.quantity,  d.name, d.about, d.manufacturingDate, d.price, MIN(di.imageUrl) AS imageUrl FROM Shopping_Cart sc 
JOIN Drone d ON sc.idDrone = d.idDrone LEFT 
JOIN Drone_Image di ON d.idDrone = di.idDrone WHERE sc.idUser = 3 GROUP BY sc.idUser, sc.idDrone, sc.quantity, d.name, d.about, 
d.manufacturingDate, d.price;

SELECT dd.idDiscount, dd.lastDiscountDate, dd.isActive, di.amount, di.startDate, di.endDate 
                 FROM Drone_Discount dd
                 JOIN Discount di ON dd.idDiscount = di.idDiscount
                 WHERE dd.idDrone = 12 AND dd.isActive = 1


SELECT d.*, m.name AS manufacturerName 
                FROM Drone d
                JOIN Manufacturer m ON d.idManufacturer = m.idManufacturer
                WHERE d.idDrone = 12 OR d.name = 'evo';
                
                
SELECT d.idDrone, d.name AS droneName, m.name AS manufacturerName, d.price, 
                       MIN(dI.imageUrl) AS imageUrl, ds.amount
                FROM drone d 
                JOIN Manufacturer m ON d.idManufacturer = m.idManufacturer
                LEFT JOIN Drone_Image dI ON d.idDrone = dI.idDrone
                JOIN Drone_Discount dd ON d.idDrone = dd.idDrone
                JOIN Discount ds ON dd.idDiscount = ds.idDiscount
                WHERE dd.isActive = 1
                GROUP BY d.idDrone, droneName, manufacturerName, d.price, ds.amount;               
                


SELECT sc.idUser, sc.idDrone, sc.quantity, 
                   d.name, d.about, d.manufacturingDate, d.price AS originalPrice,
                   COALESCE(SUM(di.amount), 0) AS totalDiscount,
                   MIN(droneImg.imageUrl) AS imageUrl
            FROM Shopping_Cart sc
            JOIN Drone d ON sc.idDrone = d.idDrone
            LEFT JOIN Drone_Discount dd ON d.idDrone = dd.idDrone AND dd.isActive = 1
            LEFT JOIN Discount di ON dd.idDiscount = di.idDiscount
            LEFT JOIN Drone_Image droneImg ON d.idDrone = droneImg.idDrone
            WHERE sc.idUser = 3 AND d.idDrone = 12
            GROUP BY sc.idUser, sc.idDrone, sc.quantity, d.name, d.about, d.manufacturingDate, d.price;
            
            
 SELECT sc.idUser, sc.idDrone, sc.quantity, 
                       d.name, d.about, d.manufacturingDate, d.price AS originalPrice,
                       (SELECT di.amount FROM Drone_Discount dd
                        JOIN Discount di ON dd.idDiscount = di.idDiscount
                        WHERE dd.idDrone = d.idDrone AND dd.isActive = 1
                        ORDER BY di.startDate DESC LIMIT 1) AS discountAmount,
                       MIN(droneImg.imageUrl) AS imageUrl
                FROM Shopping_Cart sc
                JOIN Drone d ON sc.idDrone = d.idDrone
                LEFT JOIN Drone_Image droneImg ON d.idDrone = droneImg.idDrone
                WHERE sc.idUser = 3
                GROUP BY sc.idUser, sc.idDrone, sc.quantity, d.name, d.about, d.manufacturingDate, d.price;           
            