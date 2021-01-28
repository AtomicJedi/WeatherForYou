# Node + Express + postgres template

Заготовка для создания проектов на связке Express + postgres

## System Requirements

    Docker and docker-compose
    
## Install docker

    sudo apt update
    sudo apt install docker.io docker-compose

## Порядок работы

1. Клонируем репозиторий с шаблоном в директорию с проектом

   ```git clone https://gitlab.qbex.io/environment/express-postgres-docker```

2. Переходим в директорию проекта
   
   ```cd express-postgres-docker```

4. Запускаем сервис Node + Express + postgres в фоновом режиме
   
   ```docker-compose up -d```

После выполнения данной команды приложение будет доступно по адресу **localhost:9000**, а база данных по адресу **localhost:5432**

## Рабочие моменты

1. При внесении изменений в код приложения сервис api перезапускается автоматически
2. После того как были установлены/удалены npm пакеты нужно пересобрать контейнер api:

    ```docker-compose build api && docker-compose restart api```

3. При возникновении ошибки сборки выполнить комманду из под суперпользователя
    
    ```sudo docker-compose build api && docker-compose restart api```

## База данных

Для базы данных создаётся отдельный volume. Данные находящиеся в контейнере дублируются на жетский диск хоста. Директория "db_postgres".

## Возможные трудности

1. При запуске сервиса через docker-compose express api доступно по порту **9000**, а postgres по порту **5432**. При старте сервиса возможна ошибка в случае если на хосте заняты данные порты - либо уже работает express приложение, либо установленная локально MongoDB. Есть два возможных решения данной проблемы:
   1. Остановить локально установленную MongoDB и все приложения которые слушают порт 9000
   2. Поменять порты в docker-compose.yml. Изменять нужно значение находящееся слева от двоеточия которое находится в секции **ports**
   