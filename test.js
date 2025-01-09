/**
 * ТРЕБОВАНИЕ:
 *
 * Необходимо реализовать функцию calculateLeaderboardPlaces.
 * Функция распределяет места пользователей, учитывая ограничения для получения первых мест и набранные пользователями очки.
 * Подробное ТЗ смотреть в readme.md
 *
 * Файл preview.png носит иллюстративный характер, не нужно релизовывать UI!
 * Реализованную функцию прислать в виде js файла
 */

/**
 * ТЕХНИЧЕСКИЕ ОГРАНИЧЕНИЯ:
 *
 * количество очков это всегда целое положительное число
 * firstPlaceMinScore > secondPlaceMinScore > thirdPlaceMinScore > 0
 * в конкурсе участвует от 1 до 100 пользователей
 * 2 пользователя не могут набрать одинаковое количество баллов (разные баллы у пользователей гарантируются бизнес-логикой, не стоит усложнять алгоритм)
 * нет ограничений на скорость работы функции и потребляемую ей память
 * при реализации функции разрешается использование любых библиотек, любого стиля написания кода
 * в функцию передаются только валидные данные, которые соответствуют предыдущим ограничениям (проверять это в функции не нужно)
 */

/**
 * ВХОДНЫЕ ДАННЫЕ:
 *
 * @param users - это список пользователей и заработанные каждым из них очки,
 * это неотсортированный массив вида [{userId: "id1", score: score1}, ... , {userId: "idn", score: scoreN}]
 * @param minScores - это объект вида { firstPlaceMinScore: score1, secondPlaceMinScore: score2, thirdPlaceMinScore : score3 }
 */

/**
 * РЕЗУЛЬТАТ:
 *
 * Функция должна вернуть пользователей с занятыми ими местами:
 * [{userId: "id1", place: user1Place}, ..., {userId: "idN", place: userNPlace}]
 * Места начинаются с 1, если пользователь набрал >= соответствующего минимума.
 * Если для места (1, 2, 3) никто не набрал нужного кол-ва очков, место пропускается.
 * Все остальные пользователи получают места начиная с 4 и далее.
 */

function calculateLeaderboardPlaces(users, minScores) {
    const { firstPlaceMinScore, secondPlaceMinScore, thirdPlaceMinScore } = minScores;

    // Сортируем пользователей по убыванию очков
    const sortedUsers = [...users].sort((a, b) => b.score - a.score);

    // Итоговый массив
    const result = [];

    // Хранит индексы (в sortedUsers), которые уже заняли призовые места
    const assignedIndices = new Set();

    /**
     * Функция, пытающаяся присвоить место (placeValue) пользователю,
     * который набрал не меньше, чем minScore очков.
     * Если такой пользователь найден — добавляем в result и помечаем индекс.
     */
    function assignPlaceIfPossible(placeValue, minScore) {
        // Ищем пользователя, чей score >= minScore и который ещё не назначен
        const userIndex = sortedUsers.findIndex(
            (user, index) => user.score >= minScore && !assignedIndices.has(index)
        );

        if (userIndex !== -1) {
            result.push({ userId: sortedUsers[userIndex].userId, place: placeValue });
            assignedIndices.add(userIndex);
        }
    }

    // Пытаемся занять 1, 2, 3 места
    assignPlaceIfPossible(1, firstPlaceMinScore); // >= firstPlaceMinScore
    assignPlaceIfPossible(2, secondPlaceMinScore); // >= secondPlaceMinScore
    assignPlaceIfPossible(3, thirdPlaceMinScore); // >= thirdPlaceMinScore

    // Остальные пользователи получают места, начиная с 4
    let placeCounter = 4;
    for (let i = 0; i < sortedUsers.length; i++) {
        if (!assignedIndices.has(i)) {
            result.push({
                userId: sortedUsers[i].userId,
                place: placeCounter,
            });
            placeCounter++;
        }
    }

    return result;
}
function checkResult(answer, correctAnswer) {
    if (!answer) return false;
    if (!Array.isArray(answer)) return false;
    if (answer.length !== correctAnswer.length) return false;

    for (let i = 0; i < correctAnswer.length; i++) {
        const correctAnswerElement = correctAnswer[i];
        const answerElement = answer.find(
            (x) => x.userId === correctAnswerElement.userId
        );
        if (!answerElement) return false;
        if (String(answerElement.place) !== String(correctAnswerElement.place))
            return false;
    }

    return true;
}

/**
 * Пример1:
 * minScores = { firstPlaceMinScore: 100, secondPlaceMinScore: 50, thirdPlaceMinScore : 10 }
 * Ожидаемый результат: места начинаются с 4, т.к. все места 1,2,3 пустые
 */
let result1 = calculateLeaderboardPlaces(
    [
        { userId: "id1", score: 3 },
        { userId: "id2", score: 2 },
        { userId: "id3", score: 1 }
    ],
    { firstPlaceMinScore: 100, secondPlaceMinScore: 50, thirdPlaceMinScore: 10 }
);
console.log(
    "test1",
    checkResult(result1, [
        { userId: "id1", place: 4 },
        { userId: "id2", place: 5 },
        { userId: "id3", place: 6 }
    ])
);

/**
 * Пример2:
 * Единственный пользователь, набравший >= 100, получает 1 место
 * Все остальные идут с 4 и дальше, т.к. пороги 50 и 10 не выполнены
 */
let result2 = calculateLeaderboardPlaces(
    [
        { userId: "id1", score: 100 },
        { userId: "id2", score: 3 },
        { userId: "id3", score: 2 },
        { userId: "id4", score: 1 }
    ],
    { firstPlaceMinScore: 100, secondPlaceMinScore: 50, thirdPlaceMinScore: 10 }
);
console.log(
    "test2",
    checkResult(result2, [
        { userId: "id1", place: 1 },
        { userId: "id2", place: 4 },
        { userId: "id3", place: 5 },
        { userId: "id4", place: 6 }
    ])
);

/**
 * Пример3:
 * Единственный пользователь имеет 55 очков — не достаёт до 100, значит 1 место пустое.
 * Но >= 50 => значит получает 2 место.
 */
let result3 = calculateLeaderboardPlaces(
    [{ userId: "id1", score: 55 }],
    { firstPlaceMinScore: 100, secondPlaceMinScore: 50, thirdPlaceMinScore: 10 }
);
console.log(
    "test3",
    checkResult(result3, [{ userId: "id1", place: 2 }])
);

console.log("-----------------------------------------------------");
