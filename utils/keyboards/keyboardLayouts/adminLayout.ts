export const adminLayout = [
    [
        { text: '📊 Вивести всі команди', callback_data: 'all_teams' },

    ],
    [
        { text: '📊 Керувати командами по окремо', callback_data: 'pagination_all_teams' }
    ],
    [
        { text: 'Вивести всіх користувачів', callback_data: 'all_users' }
    ],
    [
        { text: '💬 Написати всім', callback_data: 'send_to_all' },
    ],

    [
        { text: 'Почати змагання', callback_data: 'start_event' }
    ],
    [
        { text: 'Ввійти як користувач', callback_data: 'start_bot' }
    ],
]